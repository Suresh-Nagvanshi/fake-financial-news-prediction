from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
import requests
import os
import re
from functools import lru_cache

# PASSWORD HASHING
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash

# =========================
# DB IMPORT (Dual support)
# =========================
try:
    from config.db import contact_collection, user_collection, history_collection
    from model.contact import Contact
    from model.user import UserRegister, UserLogin
except ModuleNotFoundError:
    from backend.config.db import contact_collection, user_collection, history_collection
    from backend.model.contact import Contact
    from backend.model.user import UserRegister, UserLogin

# =========================
# ENV SETUP
# =========================
load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")

MODEL_URL = "https://api-inference.huggingface.co/models/SureshNagvanshi/finverify-model"

headers = {
    "Authorization": f"Bearer {HF_API_KEY}"
}

# =========================
# FASTAPI SETUP
# =========================
app = FastAPI(
    title="Financial News Credibility API",
    version="15.0.0"
)

# =========================
# CORS CONFIG
# =========================
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://fake-financial-news-prediction.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# PASSWORD HASHING
# =========================
ph = PasswordHasher()

def hash_password(password: str):
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    try:
        ph.verify(hashed_password, plain_password)
        return True
    except (VerifyMismatchError, InvalidHash):
        return False

# =========================
# REQUEST MODEL
# =========================
class NewsRequest(BaseModel):
    text: str
    email: Optional[str] = None

# =========================
# 🔥 CACHED HF CALL
# =========================
@lru_cache(maxsize=100)
def cached_prediction(text: str):
    try:
        response = requests.post(
            MODEL_URL,
            headers=headers,
            json={"inputs": text},
            timeout=6
        )
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as exc:
        status = getattr(exc.response, "status_code", None)
        body = exc.response.text if getattr(exc, "response", None) is not None else str(exc)
        print("🔥 HF request failed:", exc, "status_code:", status)
        print("🔥 HF response body:", body)
        return {"error": "Hugging Face request failed", "details": str(exc)}

    except ValueError as exc:
        print("🔥 HF JSON decode failed:", exc)
        print("🔥 HF response body:", response.text if 'response' in locals() else "<no response>")
        return {"error": "Invalid response from Hugging Face", "details": str(exc)}

# =========================
# 🔥 STRONG RULE ENGINE
# =========================
def rule_based_check(text: str):
    text_lower = text.lower()

    # 🔥 SUPER STRONG REPO RATE CHECK
    if re.search(r"\brepo\b", text_lower):
        numbers = re.findall(r"\d+\.?\d*", text_lower)

        for num in numbers:
            try:
                value = float(num)

                # 🚨 HARD LIMIT: repo rates above 20 are unrealistic in this context
                if value >= 20:
                    print("🚨 RULE: Unrealistic repo rate detected:", value)
                    return "Fake"

            except ValueError:
                continue

    # 🚨 SCAM DETECTION
    scam_keywords = [
        "guaranteed",
        "no risk",
        "double money",
        "100% return",
        "overnight profit"
    ]

    if any(k in text_lower for k in scam_keywords):
        print("🚨 RULE: Scam keyword detected")
        return "Fake"

    return None

# =========================
# ROOT
# =========================
@app.get("/")
async def root():
    return {"message": "API running 🚀"}

# =========================
# PREDICT
# =========================
@app.post("/predict")
async def predict_news(request: NewsRequest):
    try:
        text = request.text[:512]

        if not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        print("\n📩 INPUT:", text)

        # 🔥 STEP 1: RULE FIRST (FORCED)
        rule_result = rule_based_check(text)

        print("⚙️ RULE RESULT:", rule_result)

        if rule_result:
            output = {
                "prediction": rule_result,
                "confidence": 98,
                "sentiment": "NEGATIVE"
            }

            if request.email:
                history_collection.insert_one({
                    "email": request.email,
                    "text": text,
                    **output,
                    "created_at": datetime.utcnow()
                })

            return output

        # 🔥 STEP 2: HF MODEL
        result = cached_prediction(text)

        print("🤖 HF RESPONSE:", result)

        if isinstance(result, dict) and "error" in result:
            return {
                "prediction": "Model Loading",
                "confidence": 0,
                "sentiment": "N/A"
            }

        try:
            label = result[0][0]["label"]
            score = result[0][0]["score"]
        except:
            return {
                "prediction": "Error",
                "confidence": 0,
                "sentiment": "N/A"
            }

        credibility = "Fake" if "FAKE" in label.upper() else "Real"

        output = {
            "prediction": credibility,
            "confidence": round(score * 100, 2),
            "sentiment": "N/A"
        }

        if request.email:
            history_collection.insert_one({
                "email": request.email,
                "text": text,
                **output,
                "created_at": datetime.utcnow()
            })

        return output

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# HISTORY
# =========================
@app.get("/history/{email}")
async def get_history(email: str):
    data = list(history_collection.find({"email": email}, {"_id": 0}))
    return data[::-1]

# =========================
# CONTACT
# =========================
@app.post("/contact")
async def submit_contact(contact: Contact):
    data = contact.dict()
    data["created_at"] = datetime.utcnow()
    contact_collection.insert_one(data)
    return {"message": "Query submitted successfully"}

# =========================
# REGISTER
# =========================
@app.post("/register")
async def register_user(user: UserRegister):
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    user_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "created_at": datetime.utcnow()
    })

    return {"message": "User registered successfully"}

# =========================
# LOGIN
# =========================
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
            "email": db_user["email"]
        }
    }

# =========================
# HEALTH
# =========================
@app.get("/health")
async def health():
    return {"status": "OK"}