from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel
from transformers import pipeline
import os
from dotenv import load_dotenv
from datetime import datetime

# PASSWORD HASHING (ARGON2)
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash

# DB + MODELS
from backend.config.db import contact_collection, user_collection, history_collection
from backend.model.contact import Contact
from backend.model.user import UserRegister, UserLogin


# =========================
# ENV SETUP
# =========================
load_dotenv()
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

# =========================
# FASTAPI SETUP
# =========================
app = FastAPI(
    title="Financial News Credibility API",
    description="Detect fake financial news using DistilBERT + Sentiment + Rule-based filtering",
    version="7.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# PASSWORD HASHING
# =========================
ph = PasswordHasher()

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        ph.verify(hashed_password, plain_password)
        return True
    except (VerifyMismatchError, InvalidHash):
        return False


# =========================
# PATH SETUP
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.getenv(
    "MODEL_PATH",
    os.path.join(BASE_DIR, "models", "distilbert_model")
)

print("Loading model from:", MODEL_PATH)

classifier = None
sentiment_analyzer = None

# =========================
# LOAD MODELS
# =========================
try:
    classifier = pipeline(
        "text-classification",
        model=MODEL_PATH,
        tokenizer=MODEL_PATH
    )
    print("Fake news model loaded!")
except Exception as e:
    print("Model error:", str(e))

try:
    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )
    print("Sentiment model loaded!")
except Exception as e:
    print("Sentiment error:", str(e))


# =========================
# REQUEST MODEL
# =========================
class NewsRequest(BaseModel):
    text: str
    email: Optional[str] = None  # optional for history tracking


# =========================
# ROOT
# =========================
@app.get("/")
async def root():
    return {"message": "API running 🚀", "docs": "/docs"}


# =========================
# PREDICT API
# =========================
@app.post("/predict")
async def predict_news(request: NewsRequest):

    if classifier is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        text = request.text[:512]
        email = request.email
        text_lower = text.lower()

        result = classifier(text)[0]
        confidence = result["score"] * 100
        credibility = "Real" if result["label"] == "LABEL_0" else "Fake"

        # Rule-based override
        fake_keywords = [
            "secretly", "overnight", "guaranteed",
            "no risk", "double money", "100% return"
        ]

        if any(word in text_lower for word in fake_keywords):
            credibility = "Fake"

        sentiment = sentiment_analyzer(text)[0]["label"]

        # 🔥 SAVE HISTORY
        if email:
            history_collection.insert_one({
                "email": email,
                "text": text,
                "prediction": credibility,
                "confidence": f"{round(confidence, 2)}%",
                "sentiment": sentiment,
                "created_at": datetime.utcnow()
            })

        return {
            "prediction": credibility,
            "confidence": round(confidence, 2),
            "sentiment": sentiment,
            "text_analyzed": text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# GET HISTORY
# =========================
@app.get("/history/{email}")
async def get_history(email: str):
    try:
        data = list(history_collection.find({"email": email}, {"_id": 0}))
        return data[::-1]  # latest first
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# CONTACT API
# =========================
@app.post("/contact")
async def submit_contact(contact: Contact):
    try:
        data = contact.dict()
        data["created_at"] = datetime.utcnow()

        contact_collection.insert_one(data)

        return {"message": "Query submitted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# REGISTER API
# =========================
@app.post("/register")
async def register_user(user: UserRegister):
    try:
        existing = user_collection.find_one({"email": user.email})

        if existing:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_password = hash_password(user.password)

        user_data = {
            "name": user.name,
            "email": user.email,
            "password": hashed_password,
            "created_at": datetime.utcnow()
        }

        user_collection.insert_one(user_data)

        return {"message": "User registered successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# LOGIN API
# =========================
@app.post("/login")
async def login_user(user: UserLogin):
    try:
        db_user = user_collection.find_one({"email": user.email})

        if not db_user:
            raise HTTPException(status_code=400, detail="Invalid email")

        if not verify_password(user.password, db_user["password"]):
            raise HTTPException(status_code=400, detail="Invalid password")

        return {
            "message": "Login successful",
            "user": {
                "name": db_user["name"],
                "email": db_user["email"]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
async def health():
    return {
        "status": "OK",
        "model_loaded": classifier is not None
    }