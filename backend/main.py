from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import os
from dotenv import load_dotenv
from backend.config.db import contact_collection
from backend.model.contact import Contact
from datetime import datetime

# =========================
# ENV SETUP
# =========================
load_dotenv()
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

# =========================
# 🚀 FASTAPI SETUP
# =========================
app = FastAPI(
    title="Financial News Credibility API",
    description="Detect fake financial news using DistilBERT + Sentiment + Rule-based filtering",
    version="4.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# PATH SETUP
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.getenv(
    "MODEL_PATH",
    os.path.join(BASE_DIR, "models", "distilbert_model")
)

print("--- Loading DistilBERT model from:", MODEL_PATH)

classifier = None
sentiment_analyzer = None

# =========================
# 🤖 LOAD MODELS
# =========================
try:
    classifier = pipeline(
        "text-classification",
        model=MODEL_PATH,
        tokenizer=MODEL_PATH
    )
    print("[SUCCESS] Fake news model loaded!")
except Exception as e:
    print("[ERROR] Fake news model failed:", str(e))

try:
    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )
    print("[SUCCESS] Sentiment model loaded!")
except Exception as e:
    print("[ERROR] Sentiment model failed:", str(e))


# =========================
# 📩 REQUEST MODELS
# =========================
class NewsRequest(BaseModel):
    text: str


# =========================
# 🏠 ROOT
# =========================
@app.get("/")
async def root():
    return {
        "message": "Financial News Credibility API is running 🚀",
        "docs": "/docs"
    }


# =========================
# 🔮 PREDICTION API
# =========================
@app.post("/predict")
async def predict_news(request: NewsRequest):

    if classifier is None:
        raise HTTPException(status_code=500, detail="Fake news model not loaded")

    if sentiment_analyzer is None:
        raise HTTPException(status_code=500, detail="Sentiment model not loaded")

    try:
        text_input = request.text[:512]
        text_lower = text_input.lower()

        # ML Prediction
        result = classifier(text_input)[0]
        label = result['label']
        confidence = result['score'] * 100

        credibility = "Real" if label == "LABEL_0" else "Fake"

        # Rule-based override
        fake_keywords = [
            "secretly", "overnight", "guaranteed",
            "no risk", "double money", "100% return",
            "instant profit", "no loss"
        ]

        if any(word in text_lower for word in fake_keywords):
            credibility = "Fake"

        # Sentiment
        sentiment_result = sentiment_analyzer(text_input)[0]
        sentiment = sentiment_result['label']

        return {
            "credibility": credibility,
            "confidence": f"{round(confidence, 2)}%",
            "sentiment": sentiment,
            "text_analyzed": text_input[:60] + "..."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# 📬 CONTACT API (NEW)
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
# ❤️ HEALTH CHECK
# =========================
@app.get("/health")
async def health_check():
    return {
        "status": "Operational",
        "models": {
            "fake_news_model": classifier is not None,
            "sentiment_model": sentiment_analyzer is not None
        }
    }