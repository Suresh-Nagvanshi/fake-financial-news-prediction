from datetime import datetime
from functools import lru_cache
import os
from pathlib import Path
import re
from typing import Optional

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHash, VerifyMismatchError
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import snapshot_download
from pydantic import BaseModel
from transformers import pipeline

try:
    from config.db import contact_collection, history_collection, user_collection
    from model.contact import Contact
    from model.user import UserLogin, UserRegister
except ModuleNotFoundError:
    from backend.config.db import contact_collection, history_collection, user_collection
    from backend.model.contact import Contact
    from backend.model.user import UserLogin, UserRegister


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
DEFAULT_MODEL_REPO = "SureshNagvanshi/finverify-model"


def resolve_model_path() -> Path:
    raw_model_path = os.getenv("MODEL_PATH")
    if not raw_model_path:
        return BASE_DIR / "models" / "distilbert_model"

    candidate = Path(raw_model_path).expanduser()
    if candidate.is_absolute():
        return candidate

    backend_relative = (BASE_DIR / candidate).resolve()
    if backend_relative.exists():
        return backend_relative

    return (PROJECT_DIR / candidate).resolve()


MODEL_PATH = resolve_model_path()
MODEL_REPO_ID = os.getenv("MODEL_REPO_ID", DEFAULT_MODEL_REPO)
HF_DOWNLOAD_TOKEN = os.getenv("HF_API_KEY") or os.getenv("HF_TOKEN")

app = FastAPI(
    title="Financial News Credibility API",
    version="16.0.0",
)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://fake-financial-news-prediction.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ph = PasswordHasher()


class NewsRequest(BaseModel):
    text: str
    email: Optional[str] = None


def model_files_present(path: Path) -> bool:
    required_files = [
        "config.json",
        "tokenizer.json",
        "tokenizer_config.json",
    ]
    weights_present = (path / "model.safetensors").exists() or (path / "pytorch_model.bin").exists()
    return path.exists() and all((path / file_name).exists() for file_name in required_files) and weights_present


def hash_password(password: str):
    return ph.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    try:
        ph.verify(hashed_password, plain_password)
        return True
    except (VerifyMismatchError, InvalidHash):
        return False


@lru_cache(maxsize=1)
def get_classifier():
    ensure_model_available()

    return pipeline(
        "text-classification",
        model=str(MODEL_PATH),
        tokenizer=str(MODEL_PATH),
    )


@lru_cache(maxsize=100)
def cached_prediction(text: str):
    classifier = get_classifier()
    return classifier(text, truncation=True, max_length=128)


def rule_based_check(text: str):
    text_lower = text.lower()

    if re.search(r"\brepo\b", text_lower):
        numbers = re.findall(r"\d+\.?\d*", text_lower)
        for num in numbers:
            try:
                value = float(num)
                if value >= 20:
                    print("RULE: Unrealistic repo rate detected:", value)
                    return "Fake"
            except ValueError:
                continue

    scam_keywords = [
        "guaranteed",
        "no risk",
        "double money",
        "100% return",
        "overnight profit",
    ]

    if any(keyword in text_lower for keyword in scam_keywords):
        print("RULE: Scam keyword detected")
        return "Fake"

    return None


def map_label_to_prediction(label: str) -> str:
    normalized = label.strip().upper()

    if normalized in {"LABEL_0", "0", "FAKE"}:
        return "Fake"
    if normalized in {"LABEL_1", "1", "REAL"}:
        return "Real"

    return "Fake" if "FAKE" in normalized else "Real"


def ensure_model_available() -> Path:
    if model_files_present(MODEL_PATH):
        return MODEL_PATH

    MODEL_PATH.mkdir(parents=True, exist_ok=True)
    print(f"Model files not found at {MODEL_PATH}. Downloading from {MODEL_REPO_ID}...")

    snapshot_download(
        repo_id=MODEL_REPO_ID,
        repo_type="model",
        local_dir=str(MODEL_PATH),
        local_dir_use_symlinks=False,
        token=HF_DOWNLOAD_TOKEN,
    )

    if not model_files_present(MODEL_PATH):
        raise FileNotFoundError(
            f"Model download completed, but required files are still missing at {MODEL_PATH}"
        )

    print(f"Model downloaded successfully to {MODEL_PATH}")
    return MODEL_PATH


@app.get("/")
async def root():
    return {"message": "API running"}


@app.on_event("startup")
async def startup_event():
    ensure_model_available()


@app.post("/predict")
async def predict_news(request: NewsRequest):
    try:
        text = request.text[:512]

        if not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        print("\nINPUT:", text)

        rule_result = rule_based_check(text)
        print("RULE RESULT:", rule_result)

        if rule_result:
            output = {
                "prediction": rule_result,
                "confidence": 98,
                "sentiment": "NEGATIVE",
            }

            if request.email:
                history_collection.insert_one(
                    {
                        "email": request.email,
                        "text": text,
                        **output,
                        "created_at": datetime.utcnow(),
                    }
                )

            return output

        result = cached_prediction(text)
        print("LOCAL MODEL RESPONSE:", result)

        if not result:
            return {
                "prediction": "Error",
                "confidence": 0,
                "sentiment": "N/A",
            }

        top_result = result[0]
        label = top_result.get("label", "")
        score = float(top_result.get("score", 0))

        output = {
            "prediction": map_label_to_prediction(label),
            "confidence": round(score * 100, 2),
            "sentiment": "N/A",
        }

        if request.email:
            history_collection.insert_one(
                {
                    "email": request.email,
                    "text": text,
                    **output,
                    "created_at": datetime.utcnow(),
                }
            )

        return output

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/history/{email}")
async def get_history(email: str):
    data = list(history_collection.find({"email": email}, {"_id": 0}))
    return data[::-1]


@app.post("/contact")
async def submit_contact(contact: Contact):
    data = contact.dict()
    data["created_at"] = datetime.utcnow()
    contact_collection.insert_one(data)
    return {"message": "Query submitted successfully"}


@app.post("/register")
async def register_user(user: UserRegister):
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    user_collection.insert_one(
        {
            "name": user.name,
            "email": user.email,
            "password": hash_password(user.password),
            "created_at": datetime.utcnow(),
        }
    )

    return {"message": "User registered successfully"}


@app.post("/login")
async def login_user(user: UserLogin):
    db_user = user_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    return {
        "message": "Login successful",
        "user": {
            "name": db_user["name"],
            "email": db_user["email"],
        },
    }


@app.get("/health")
async def health():
    return {
        "status": "OK",
        "model_path": str(MODEL_PATH),
        "model_repo_id": MODEL_REPO_ID,
        "model_files_present": model_files_present(MODEL_PATH),
        "model_loaded": get_classifier.cache_info().currsize > 0,
    }
