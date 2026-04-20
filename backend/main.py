from datetime import datetime
import json
import os
from pathlib import Path
import re
from typing import Optional
from urllib import error, request

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHash, VerifyMismatchError
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
DEFAULT_INFERENCE_URL = "https://sureshnagvanshi-finverify-inference.hf.space/predict"
INFERENCE_API_URL = os.getenv("INFERENCE_API_URL", DEFAULT_INFERENCE_URL).strip()

THRESHOLD_CONFIG_PATH = BASE_DIR / "models" / "distilbert_model" / "threshold_config.json"
DEFAULT_FAKE_THRESHOLD = 0.65

def load_fake_threshold():
    if THRESHOLD_CONFIG_PATH.exists():
        try:
            with open(THRESHOLD_CONFIG_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                return float(data.get("fake_threshold", DEFAULT_FAKE_THRESHOLD))
        except Exception:
            return DEFAULT_FAKE_THRESHOLD
    return DEFAULT_FAKE_THRESHOLD

FAKE_THRESHOLD = load_fake_threshold()

app = FastAPI(
    title="Financial News Credibility API",
    version="18.0.0",
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

def hash_password(password: str):
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    try:
        ph.verify(hashed_password, plain_password)
        return True
    except (VerifyMismatchError, InvalidHash):
        return False

def call_inference_api(text: str):
    payload = json.dumps({"text": text}).encode("utf-8")
    api_request = request.Request(
        INFERENCE_API_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with request.urlopen(api_request, timeout=120) as response:
            body = response.read().decode("utf-8")
            return json.loads(body)
    except error.HTTPError as exc:
        details = exc.read().decode("utf-8", errors="replace")
        raise HTTPException(
            status_code=502,
            detail=f"Inference API returned {exc.code}: {details}",
        ) from exc
    except error.URLError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to reach inference API: {exc.reason}",
        ) from exc
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Inference API returned invalid JSON: {exc}",
        ) from exc

def strong_rule_based_check(text: str):
    text_lower = text.lower()

    if re.search(r"\brepo\b", text_lower):
        numbers = re.findall(r"\d+\.?\d*", text_lower)
        for num in numbers:
            try:
                value = float(num)
                if value >= 20:
                    return {
                        "prediction": "Fake",
                        "confidence": 99.0,
                        "sentiment": "NEGATIVE",
                        "source": "rule"
                    }
            except ValueError:
                continue

    return None

def normalize_model_output(output: dict):
    prediction = output.get("prediction", "Real")
    confidence = output.get("confidence", 0)
    sentiment = output.get("sentiment", "NEUTRAL")

    fake_probability = output.get("fake_probability")
    if fake_probability is None:
        if prediction == "Fake":
            fake_probability = float(confidence) / 100.0 if float(confidence) > 1 else float(confidence)
        else:
            fake_probability = 1.0 - (float(confidence) / 100.0 if float(confidence) > 1 else float(confidence))

    final_prediction = "Fake" if fake_probability >= FAKE_THRESHOLD else "Real"
    final_confidence = round(max(fake_probability, 1 - fake_probability) * 100, 2)

    return {
        "prediction": final_prediction,
        "confidence": final_confidence,
        "sentiment": sentiment,
        "fake_probability": round(fake_probability, 4),
        "threshold_used": FAKE_THRESHOLD,
        "source": "model"
    }

@app.get("/")
async def root():
    return {"message": "API running"}

@app.post("/predict")
async def predict_news(request_body: NewsRequest):
    try:
        text = request_body.text[:512]

        if not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        rule_output = strong_rule_based_check(text)

        if rule_output:
            output = rule_output
        else:
            raw_output = call_inference_api(text)
            output = normalize_model_output(raw_output)

        if request_body.email:
            history_collection.insert_one(
                {
                    "email": request_body.email,
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
        "inference_api_url": INFERENCE_API_URL,
        "fake_threshold": FAKE_THRESHOLD,
    }