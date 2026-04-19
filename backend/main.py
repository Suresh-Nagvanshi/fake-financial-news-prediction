from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime

# PASSWORD HASHING
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash

# DB IMPORT (Dual environment support)
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

# =========================
# FASTAPI SETUP
# =========================
app = FastAPI(
    title="Financial News Credibility API",
    description="Lightweight deployment version",
    version="10.0.0"
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

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
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
# ROOT
# =========================
@app.get("/")
async def root():
    return {"message": "API running 🚀"}

# =========================
# PREDICT API
# =========================
@app.post("/predict")
async def predict_news(request: NewsRequest):
    try:
        text = request.text[:512]

        if not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        email = request.email

        fake_keywords = [
            "secretly", "overnight", "guaranteed",
            "no risk", "double money", "100% return"
        ]

        credibility = "Fake" if any(k in text.lower() for k in fake_keywords) else "Real"

        confidence = 85 if credibility == "Fake" else 75
        sentiment = "NEGATIVE" if credibility == "Fake" else "POSITIVE"

        result = {
            "prediction": credibility,
            "confidence": confidence,
            "sentiment": sentiment
        }

        if email:
            history_collection.insert_one({
                "email": email,
                "text": text,
                **result,
                "created_at": datetime.utcnow()
            })

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# HISTORY API
# =========================
@app.get("/history/{email}")
async def get_history(email: str):
    try:
        data = list(history_collection.find({"email": email}, {"_id": 0}))
        return data[::-1]
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
        if user_collection.find_one({"email": user.email}):
            raise HTTPException(status_code=400, detail="User already exists")

        user_collection.insert_one({
            "name": user.name,
            "email": user.email,
            "password": hash_password(user.password),
            "created_at": datetime.utcnow()
        })

        return {"message": "User registered successfully"}

    except HTTPException:
        raise
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

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
async def health():
    return {"status": "OK"}