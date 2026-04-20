from functools import lru_cache
from pathlib import Path
import math

import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

MODEL_DIR = Path("./")
MODEL_PATH = MODEL_DIR / "model.pkl"
VECTORIZER_PATH = MODEL_DIR / "vectorizer.pkl"


class NewsRequest(BaseModel):
    text: str


def model_files_present() -> bool:
    return MODEL_PATH.exists() and VECTORIZER_PATH.exists()


@lru_cache(maxsize=1)
def get_model_bundle():
    if not model_files_present():
        raise FileNotFoundError("model.pkl or vectorizer.pkl is missing from the Space")

    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    return model, vectorizer


def map_label(label: int) -> str:
    return "Fake" if int(label) == 0 else "Real"


def score_to_confidence(raw_score: float) -> float:
    probability = 1 / (1 + math.exp(-abs(raw_score)))
    return round(probability * 100, 2)


app = FastAPI(title="Finverify Inference API", version="2.0.0")


@app.get("/")
async def root():
    return {"message": "Finverify inference API running"}


@app.get("/health")
async def health():
    return {
        "status": "OK",
        "model_files_present": model_files_present(),
        "model_loaded": get_model_bundle.cache_info().currsize > 0,
        "model_type": "tfidf-passive-aggressive",
    }


@app.post("/predict")
async def predict(request: NewsRequest):
    text = request.text[:512]

    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        model, vectorizer = get_model_bundle()
        features = vectorizer.transform([text])
        prediction = int(model.predict(features)[0])

        if hasattr(model, "decision_function"):
            raw_score = float(model.decision_function(features)[0])
            confidence = score_to_confidence(raw_score)
        else:
            confidence = 75.0

        return {
            "prediction": map_label(prediction),
            "confidence": confidence,
            "sentiment": "N/A",
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
