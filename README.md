# 📈 Financial Fake News & Market Manipulation Detector

A full-stack AI application that detects fake financial news using Natural Language Processing (NLP).
The system uses a DistilBERT transformer model to analyze financial text and predict whether the news is **Real or Fake**, along with a confidence score.

---

## 🧠 Key Features

* 🔍 Detect fake financial news using AI
* 🤖 Transformer-based model (DistilBERT)
* ⚡ Real-time predictions via FastAPI
* 🌐 Interactive React frontend
* 📊 Confidence score display
* 🧪 Swagger API testing support
* 💡 Scalable architecture (ready for DB + caching)

---

## 🏗 System Architecture

| Layer    | Technology                |
| -------- | ------------------------- |
| Frontend | React.js (Vite)           |
| Backend  | FastAPI (Python)          |
| ML Model | DistilBERT (Transformers) |
| Data     | Financial news dataset    |

---

## 📂 Project Structure

fake-financial-news-prediction/
│
├── backend/
│   ├── ml/
│   │   ├── preprocess.py
│   │   ├── filter_financial_news.py
│   │   ├── distilbert_trainer.py
│   │
│   ├── models/              # ignored in git
│   ├── main.py
│   └── requirements.txt
│
├── data/                   # ignored in git
│   ├── raw/
│   └── processed/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── notebooks/
├── tests/
├── run_pipeline.sh
└── README.md

---

## ⚙️ Complete Setup Guide

### 🔽 1. Clone Repository

git clone https://github.com/Suresh-Nagvanshi/fake-financial-news-prediction.git
cd fake-financial-news-prediction

---

### 🐍 2. Setup Backend

python -m venv venv
venv\Scripts\activate      (Windows)

# source venv/bin/activate (Mac/Linux)

pip install -r backend/requirements.txt

---

### 📦 Required Python Packages

pip install fastapi uvicorn pandas scikit-learn joblib
pip install transformers datasets torch accelerate

---

### 🤖 3. Train DistilBERT Model

python backend/ml/distilbert_trainer.py

👉 Model will be saved at:
D:/distilbert_model

---

## ☁️ Model Download (Google Drive)

Due to size limitations, the trained DistilBERT model is NOT included in this repository.

👉 Download from:
(https://drive.google.com/drive/folders/1p5mun8MS3irGwqjEFG55M5sjXNGejIi4?usp=sharing)

---

### 📥 Steps to Use the Model

1. Download the model folder
2. Extract it
3. Place it inside:

backend/models/distilbert_model/

---

### 📂 Required Folder Structure

backend/models/distilbert_model/

Must contain:

* config.json
* model.safetensors
* tokenizer.json
* tokenizer_config.json
* vocab.txt
* special_tokens_map.json

---

### ⚠️ Important

* Folder name must be exactly: distilbert_model
* If path is different → update MODEL_PATH in backend/main.py

---

### 🚫 Why Model is Not Included?

* Exceeds GitHub size limits
* Keeps repo lightweight
* Faster cloning

---

### 🚀 4. Start Backend

python -m uvicorn backend.main:app --reload

Open:
http://127.0.0.1:8000
http://127.0.0.1:8000/docs

---

### 🌐 5. Start Frontend

cd frontend
npm install
npm run dev

Open:
http://localhost:5173

---

## 🔮 API Example

Request:

{
"text": "Stock market crashed due to fraud allegations"
}

Response:

{
"prediction": "Fake",
"confidence": "96.07%"
}

---

## 🧠 Model Details

* Model: distilbert-base-uncased
* Task: Binary classification (Fake / Real)
* Max input length: 128 tokens
* Output: Label + confidence score

---

## 🚫 Files Not Included in Git

* datasets (.csv)
* trained models (.safetensors, .pt)
* virtual environments

---

## 🚀 Future Improvements

* MongoDB caching
* Authentication
* UI enhancements
* Explainable AI
* Live financial APIs

---

## 🎯 Project Highlights

* ✔ Full-stack AI application
* ✔ Transformer-based NLP model
* ✔ Real-time prediction system
* ✔ Scalable architecture
* ✔ Industry-level project

---

## 👨‍💻 Author

Suresh Nagvanshi
Nihal Panwar
Faraz Ahmed
Astha Shukla
Tisha Chhabra

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
