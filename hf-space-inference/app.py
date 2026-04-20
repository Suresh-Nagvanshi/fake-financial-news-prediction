from functools import lru_cache
from pathlib import Path

from fastapi import FastAPI, HTTPException
from huggingface_hub import snapshot_download
from pydantic import BaseModel
from transformers import pipeline

MODEL_REPO_ID = "SureshNagvanshi/finverify-model"
MODEL_DIR = Path("./model")


class NewsRequest(BaseModel):
    text: str


def model_files_present(path: Path) -> bool:
    required_files = [
        "config.json",
        "tokenizer.json",
        "tokenizer_config.json",
    ]
    has_weights = (path / "model.safetensors").exists() or (path / "pytorch_model.bin").exists()
    return path.exists() and all((path / name).exists() for name in required_files) and has_weights


def ensure_model_available() -> Path:
    if model_files_present(MODEL_DIR):
        return MODEL_DIR

    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    snapshot_download(
        repo_id=MODEL_REPO_ID,
        repo_type="model",
        local_dir=str(MODEL_DIR),
        local_dir_use_symlinks=False,
    )

    if not model_files_present(MODEL_DIR):
        raise FileNotFoundError("Model files are missing after download")

    return MODEL_DIR


@lru_cache(maxsize=1)
def get_classifier():
    ensure_model_available()
    return pipeline(
        "text-classification",
        model=str(MODEL_DIR),
        tokenizer=str(MODEL_DIR),
    )


def map_label(label: str) -> str:
    normalized = label.strip().upper()
    if normalized in {"LABEL_0", "0", "FAKE"}:
        return "Fake"
    if normalized in {"LABEL_1", "1", "REAL"}:
        return "Real"
    return "Fake" if "FAKE" in normalized else "Real"


app = FastAPI(title="Finverify Inference API", version="1.0.0")


@app.get("/")
async def root():
    return {"message": "Finverify inference API running"}


@app.get("/health")
async def health():
    return {
        "status": "OK",
        "model_repo_id": MODEL_REPO_ID,
        "model_files_present": model_files_present(MODEL_DIR),
        "model_loaded": get_classifier.cache_info().currsize > 0,
    }


@app.post("/predict")
async def predict(request: NewsRequest):
    text = request.text[:512]

    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        result = get_classifier()(text, truncation=True, max_length=128)
        top = result[0]
        label = top.get("label", "")
        score = float(top.get("score", 0))

        return {
            "prediction": map_label(label),
            "confidence": round(score * 100, 2),
            "sentiment": "N/A",
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
