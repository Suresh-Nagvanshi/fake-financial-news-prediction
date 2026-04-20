from functools import lru_cache
from pathlib import Path
import json
import math

import numpy as np
import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForSequenceClassification, AutoTokenizer

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "backend" / "models" / "distilbert_model_cpu"
if not MODEL_DIR.exists():
    MODEL_DIR = BASE_DIR / "distilbert_model_cpu"

MODEL_NAME = str(MODEL_DIR)
THRESHOLD_PATH = MODEL_DIR / "threshold_config.json"
DEFAULT_FAKE_THRESHOLD = 0.46
MAX_LENGTH = 64

class NewsRequest(BaseModel):
    text: str

def load_threshold():
    if THRESHOLD_PATH.exists():
        try:
            with open(THRESHOLD_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                return float(data.get("fake_threshold", DEFAULT_FAKE_THRESHOLD))
        except Exception:
            return DEFAULT_FAKE_THRESHOLD
    return DEFAULT_FAKE_THRESHOLD

FAKE_THRESHOLD = load_threshold()

def model_files_present() -> bool:
    required = [
        "config.json",
        "model.safetensors",
        "tokenizer.json",
        "tokenizer_config.json",
        "special_tokens_map.json",
    ]
    return all((MODEL_DIR / name).exists() for name in required)

@lru_cache(maxsize=1)
def get_model_bundle():
    if not model_files_present():
        raise FileNotFoundError(f"Missing model files in {MODEL_DIR}")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
    model.eval()
    return tokenizer, model

def softmax(logits):
    x = np.array(logits, dtype=np.float64)
    x = x - np.max(x, axis=-1, keepdims=True)
    exp_x = np.exp(x)
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

def score_to_confidence(prob: float) -> float:
    return round(max(prob, 1.0 - prob) * 100.0, 2)

app = FastAPI(title="Finverify Inference API", version="3.0.0")

@app.get("/")
async def root():
    return {"message": "Finverify inference API running"}

@app.get("/health")
async def health():
    return {
        "status": "OK",
        "model_dir": str(MODEL_DIR),
        "model_files_present": model_files_present(),
        "model_loaded": get_model_bundle.cache_info().currsize > 0,
        "fake_threshold": FAKE_THRESHOLD,
        "model_type": "distilbert-base-uncased-finetuned",
    }

@app.post("/predict")
async def predict(request: NewsRequest):
    text = request.text[:512]
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        tokenizer, model = get_model_bundle()
        inputs = tokenizer(
            text,
            truncation=True,
            max_length=MAX_LENGTH,
            padding=True,
            return_tensors="pt",
        )

        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits.cpu().numpy()[0]
            probs = softmax([logits])[0]

        fake_prob = float(probs[0])
        real_prob = float(probs[1])

        prediction = "Fake" if fake_prob >= FAKE_THRESHOLD else "Real"
        confidence = score_to_confidence(fake_prob if prediction == "Fake" else real_prob)

        return {
            "prediction": prediction,
            "confidence": confidence,
            "sentiment": "N/A",
            "fake_probability": round(fake_prob, 4),
            "real_probability": round(real_prob, 4),
            "threshold_used": FAKE_THRESHOLD,
        }

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))