from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

# =========================
# 🚀 FASTAPI SETUP
# =========================
app = FastAPI(
    title="Financial News Credibility API",
    description="Detect fake financial news using DistilBERT",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 🤖 LOAD DISTILBERT MODEL
# =========================
MODEL_PATH = "D:/distilbert_model"

print("🔄 Loading DistilBERT model...")

try:
    classifier = pipeline(
        "text-classification",
        model=MODEL_PATH,
        tokenizer=MODEL_PATH
    )
    print("✅ Model loaded successfully!")
except Exception as e:
    print("❌ Model loading failed:", e)

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
    try:
        result = classifier(request.text[:512])[0]

        label = result['label']
        confidence = result['score'] * 100

        final_label = "Real" if label == "LABEL_1" else "Fake"

        return {
            "prediction": final_label,
            "confidence": f"{round(confidence, 2)}%",
            "text_analyzed": request.text[:60] + "..."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# ❤️ HEALTH CHECK
# =========================
@app.get("/health")
async def health_check():
    return {"status": "Operational", "model": "DistilBERT"}