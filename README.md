# 📈 Financial Fake News & Market Manipulation Detector

A full-stack AI-powered web application that detects **fake financial news** using Natural Language Processing (NLP).
The system leverages a fine-tuned **DistilBERT transformer model** to classify financial text as **Real or Fake**, along with a confidence score and sentiment analysis.

---

## 🚀 Overview

Financial misinformation can lead to **market manipulation and investor losses**. This project provides an intelligent system to **analyze financial news credibility in real-time**, helping users make informed decisions.

---

## 🧠 Features

* 🔍 Detect fake financial news using AI
* 🤖 Transformer-based NLP model (DistilBERT)
* ⚡ Real-time predictions via FastAPI
* 📊 Confidence score + sentiment analysis
* 🧾 User authentication (Login/Register)
* 📁 Search history stored in MongoDB
* 🔐 Protected dashboard routes
* 🌐 Interactive React frontend (Vite)
* 🧪 Swagger API documentation (`/docs`)
* 🧩 Modular & scalable architecture

---

## 🏗️ System Architecture

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | React.js (Vite, Tailwind CSS) |
| Backend  | FastAPI (Python)              |
| ML Model | DistilBERT (HuggingFace)      |
| Database | MongoDB                       |
| Auth     | Argon2 Password Hashing       |

---

## 📂 Project Structure

```
fake-financial-news-prediction/
│
├── backend/
│   ├── ml/
│   │   ├── preprocess.py
│   │   ├── filter_financial_news.py
│   │   ├── distilbert_trainer.py
│   │
│   ├── config/
│   │   └── db.py
│   ├── model/
│   │   ├── user.py
│   │   ├── contact.py
│   │
│   ├── models/                # (ignored in git)
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── data/                     # (ignored)
├── .gitignore
├── README.md
└── run_pipeline.sh
```

---

## ⚙️ Prerequisites

Make sure you have:

* Python **3.9+**
* Node.js **18+**
* MongoDB (local or Atlas)
* Git

---

## ⚙️ Complete Setup Guide

### 🔽 1. Clone Repository

```bash
git clone https://github.com/Suresh-Nagvanshi/fake-financial-news-prediction.git
cd fake-financial-news-prediction
```

---

## 🐍 2. Backend Setup

```bash
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Mac/Linux

pip install -r backend/requirements.txt
```

---

## 🔑 3. Environment Variables

Create a `.env` file inside `backend/`:

```
MODEL_PATH=backend/models/distilbert_model
MONGO_URI=mongodb://localhost:27017/
DB_NAME=fake_news_db
PORT=8000
```

---

## 🤖 4. Model Setup

### Option A: Download Pre-trained Model

👉 Download from Google Drive:
https://drive.google.com/drive/folders/1p5mun8MS3irGwqjEFG55M5sjXNGejIi4

Place it in:

```
backend/models/distilbert_model/
```

---

### Required Files

```
config.json
model.safetensors
tokenizer.json
tokenizer_config.json
vocab.txt
special_tokens_map.json
```

---

### Option B: Train Model Yourself

```bash
python backend/ml/distilbert_trainer.py
```

---

## 🚀 5. Start Backend

```bash
python -m uvicorn backend.main:app --reload
```

Open:

* API: http://127.0.0.1:8000
* Docs: http://127.0.0.1:8000/docs

---

## 🌐 6. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 🔐 Authentication Flow

* Register new user
* Login with credentials
* Redirect to Dashboard
* Protected routes enabled
* Logout clears session

---

## 📊 Dashboard Features

* Enter financial news text
* Get:

  * Credibility (Real/Fake)
  * Confidence %
  * Sentiment
* View previous search history (MongoDB)

---

## 🔮 API Example

### Request

```json
{
  "text": "Stock market crashed due to fraud allegations",
  "email": "user@email.com"
}
```

### Response

```json
{
  "credibility": "Fake",
  "confidence": "96.07%",
  "sentiment": "NEGATIVE"
}
```

---

## 🧠 Model Details

* Model: `distilbert-base-uncased`
* Task: Binary classification (Fake / Real)
* Max input length: 128 tokens
* Output: Label + confidence + sentiment

⚠️ **Note:**
The model predicts *credibility*, not factual truth. It does not verify real-world events.

---

## 🚫 Files Ignored

* `.env`
* `node_modules/`
* `venv/`
* `backend/models/`
* datasets (`.csv`)
* model files (`.pt`, `.bin`, `.safetensors`)

---

## 🚀 Future Improvements

* 🔐 JWT Authentication (secure APIs)
* 🧠 Explainable AI (why prediction)
* 📊 Analytics dashboard
* 🌐 Live financial news APIs
* ⚡ Redis caching
* 🔍 Duplicate detection
* 📱 Mobile responsiveness

---

## 🎯 Project Highlights

* ✔ Full-stack AI application
* ✔ Transformer-based NLP model
* ✔ Real-time prediction system
* ✔ Authentication + protected routes
* ✔ MongoDB integration
* ✔ Scalable architecture

---

## 👨‍💻 Authors

* Suresh Nagvanshi
* Nihal Panwar
* Faraz Ahmed
* Astha Shukla
* Tisha Chhabra

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!

---
