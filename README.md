# 📈 Financial Fake News & Market Manipulation Detector

A full-stack machine learning application designed to detect market manipulation and fake financial news. It uses Natural Language Processing (NLP) to analyze financial news snippets and predict credibility based on verified SEC fraud cases and market data.

## 🏗 System Architecture

* **Frontend:** React.js (via Vite)
* **Backend API:** FastAPI (Python)
* **Machine Learning:** Scikit-Learn (TF-IDF Vectorization, Passive Aggressive Classifier)

## 💻 Local Development Setup (Start Here)

To run the full-stack application locally, you will need to run the backend and frontend simultaneously in two separate terminal windows.

### 1. Build the ML Models
If you are setting up the project for the first time, you must generate the machine learning models. Run this in your root folder:

```bash
bash run_pipeline.sh
```

### 2. Start the Backend (Terminal 1)
Open a terminal in the project root and run these commands to start the FastAPI server:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```
The API will run at `http://127.0.0.1:8000`. 

### 3. Start the Frontend (Terminal 2)
Open a completely new terminal window, navigate to the React folder, and start the UI:

```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser to use the dashboard.

---

## 🛠 Phase B: Next Steps & Model Upgrade (Team Handoff)

The core architecture is complete. The remaining tasks for final submission are:
1. **Frontend Styling:** Enhance the React UI in `frontend/src/App.jsx`.
2. **Model Upgrade:** Replace the baseline Scikit-Learn model with a fine-tuned `FinFakeBERT` transformer for state-of-the-art accuracy.

### FinFakeBERT Implementation Guide

**1. Install New Dependencies**
Activate the virtual environment and install the Hugging Face ecosystem:
```bash
pip install torch transformers datasets accelerate
```

**2. Create the Training Script**
Create a new file named `backend/ml/finbert_trainer.py` and run it to fine-tune the model:

```python
import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset

df = pd.read_csv('../../data/processed/financial_news.csv')
df = df.dropna(subset=['content', 'label'])

train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

train_dataset = Dataset.from_pandas(train_df)
val_dataset = Dataset.from_pandas(val_df)

model_name = "yiyanghkust/finbert-pretrain"
tokenizer = AutoTokenizer.from_pretrained(model_name)

def tokenize_function(examples):
    return tokenizer(examples["content"], padding="max_length", truncation=True, max_length=128)

tokenized_train = train_dataset.map(tokenize_function, batched=True)
tokenized_val = val_dataset.map(tokenize_function, batched=True)

model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

training_args = TrainingArguments(
    output_dir="../../backend/models/finbert_fake_news",
    eval_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    save_strategy="epoch",
    load_best_model_at_end=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train,
    eval_dataset=tokenized_val,
)

trainer.train()

model.save_pretrained("../../backend/models/finbert_final")
tokenizer.save_pretrained("../../backend/models/finbert_final")
```

**3. Update FastAPI Backend**
Once the model finishes training, overwrite `backend/main.py` to use the Hugging Face pipeline:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from pathlib import Path

app = FastAPI(
    title="Financial News Credibility API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = str(BASE_DIR / "models" / "finbert_final")

try:
    nlp_pipeline = pipeline("text-classification", model=MODEL_PATH, tokenizer=MODEL_PATH)
except Exception as e:
    pass

class NewsRequest(BaseModel):
    text: str

@app.post("/predict")
async def predict_news(request: NewsRequest):
    try:
        result = nlp_pipeline(request.text[:512])[0]
        
        raw_label = result['label']
        confidence_score = result['score'] * 100
        
        final_label = "Real" if raw_label == "LABEL_1" else "Fake"
        
        return {
            "prediction": final_label,
            "confidence": f"{round(confidence_score, 2)}%",
            "text_analyzed": request.text[:60] + "..."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "Operational", "models_loaded": True}
```