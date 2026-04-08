# 📈 Financial Fake News & Market Manipulation Detector

A full-stack AI application that detects fake financial news using Natural Language Processing (NLP).  
The system uses a **DistilBERT transformer model** to analyze financial text and predict whether the news is **Real or Fake**, along with a confidence score.

---

## 🧠 Key Features

- 🔍 Detect fake financial news using AI
- 🤖 Transformer-based model (DistilBERT)
- ⚡ Real-time predictions via FastAPI
- 🌐 Interactive React frontend
- 📊 Confidence score display
- 🧪 Swagger API testing support
- 💡 Scalable architecture (ready for DB + caching)

---

## 🏗 System Architecture

| Layer        | Technology |
|-------------|-----------|
| Frontend     | React.js (Vite) |
| Backend      | FastAPI (Python) |
| ML Model     | DistilBERT (Transformers) |
| Data         | Financial news dataset |

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
```

---

## ⚙️ Complete Setup Guide

### 🔽 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/fake-financial-news-prediction.git
cd fake-financial-news-prediction
```

---

### 🐍 2. Setup Backend

```bash
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # Mac/Linux

pip install -r backend/requirements.txt
```

---

### 📦 Required Python Packages

If needed, install manually:

```bash
pip install fastapi uvicorn pandas scikit-learn joblib
pip install transformers datasets torch accelerate
```

---

### 🤖 3. Train DistilBERT Model

Run this once:

```bash
python backend/ml/distilbert_trainer.py
```

👉 Model will be saved at:

```
D:/distilbert_model
```

(You can change this path inside the script)

---

### 🚀 4. Start Backend

```bash
python -m uvicorn backend.main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

Swagger API:

```
http://127.0.0.1:8000/docs
```

---

### 🌐 5. Start Frontend

Open a new terminal:

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

## 🔮 API Example

### Request

```json
{
  "text": "Stock market crashed due to fraud allegations"
}
```

### Response

```json
{
  "prediction": "Fake",
  "confidence": "96.07%"
}
```

---

## 🧠 Model Details

- Model: distilbert-base-uncased
- Task: Binary classification (Fake / Real)
- Max input length: 128 tokens
- Output: Label + confidence score

---

## 🚫 Files Not Included in Git

- datasets (.csv)
- trained models (.pkl, .safetensors, .pt)
- virtual environments

---

## 🚀 Future Improvements

### 🌐 Frontend Enhancements
- Homepage (Landing page)
- About Us page
- Feedback page
- Loading skeleton screens
- Prediction history UI

### 🔐 Authentication
- Signup/Login system
- Google OAuth integration

### 🗄 Database Integration (MongoDB)
- Store user inputs, predictions, confidence
- Cache repeated queries → faster results
- Reduce model load

### ⚡ Performance Optimization
- Prediction caching
- Batch inference
- Model optimization

### 📊 Advanced Features
- Explainable AI (highlight important words)
- News credibility scoring
- Sentiment analysis
- Live financial news API integration

---

## 🎯 Project Highlights

- ✔ Full-stack AI application
- ✔ Transformer-based NLP model
- ✔ Real-time prediction system
- ✔ Clean and scalable architecture
- ✔ Industry-level project

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