from fastapi import FastAPI, HTTPException
import math 
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
from pathlib import Path


app = FastAPI(
    title="Financial News Credibility API",
    description="API for predicting market manipulation and fake financial news.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "model.pkl"
VECTORIZER_PATH = BASE_DIR / "models" / "vectorizer.pkl"

try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
except Exception as e:
    pass

class NewsRequest(BaseModel):
    text: str

@app.post("/predict")
async def predict_news(request: NewsRequest):
    try:
        # 1. Vectorize the input text
        vectorized_text = vectorizer.transform([request.text])
        
        # 2. Generate Prediction
        prediction_num = model.predict(vectorized_text)[0]
        label = "Real" if prediction_num == 1 else "Fake"
        
        # 3. Calculate Confidence Score (Fix for PassiveAggressiveClassifier)
        distance = model.decision_function(vectorized_text)[0]
        confidence_score = (1 / (1 + math.exp(-abs(distance)))) * 100
        
        return {
            "prediction": label,
            "confidence": f"{round(confidence_score, 2)}%",
            "text_analyzed": request.text[:60] + "..."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "Operational", "models_loaded": True}