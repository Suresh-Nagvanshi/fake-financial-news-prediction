from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import os

# Suppress HuggingFace warning (Windows symlink)
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

# =========================
# 🚀 FASTAPI SETUP
# =========================
app = FastAPI(
    title="Financial News Credibility API",
    description="Detect fake financial news using DistilBERT + Sentiment + Rule-based filtering",
    version="4.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 🤖 LOAD MODELS
# =========================
MODEL_PATH = os.getenv(
    "MODEL_PATH",
    "models/distilbert_model"
)

print("🔄 Loading DistilBERT model from:", MODEL_PATH)

classifier = None
sentiment_analyzer = None

try:
    print("📂 Path exists:", os.path.exists(MODEL_PATH))

    classifier = pipeline(
        "text-classification",
        model=MODEL_PATH,
        tokenizer=MODEL_PATH
    )

    print("✅ Fake news model loaded!")

except Exception as e:
    print("❌ Fake news model failed:", str(e))


# =========================
# 😊 LOAD SENTIMENT MODEL
# =========================
try:
    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )
    print("✅ Sentiment model loaded!")
except Exception as e:
    print("❌ Sentiment model failed:", str(e))


# =========================
# 📩 REQUEST MODEL
# =========================
class NewsRequest(BaseModel):
    text: str


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

        # 🔮 ML Prediction
        result = classifier(text_input)[0]
        label = result['label']
        confidence = result['score'] * 100

        credibility = "Real" if label == "LABEL_0" else "Fake"

        # 🚨 RULE-BASED OVERRIDE (SMART BOOST)
        fake_keywords = [
            "secretly", "overnight", "guaranteed",
            "no risk", "double money", "100% return",
            "instant profit", "no loss"
        ]

        if any(word in text_lower for word in fake_keywords):
            credibility = "Fake"

        # 😊 Sentiment Analysis
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