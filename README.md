# 📈 Financial Fake News & Market Manipulation Detector

A full-stack machine learning application designed to detect market manipulation and fake financial news. It uses Natural Language Processing (NLP) to analyze financial news snippets and predict credibility based on verified SEC fraud cases and market data.

## 🏗 System Architecture

* **Frontend:** React.js (via Vite)
* **Backend API:** FastAPI (Python)
* **Machine Learning:** Scikit-Learn (TF-IDF Vectorization, Passive Aggressive Classifier)

## 🚀 Quick Start: The ML Pipeline

If you are setting up the project for the first time or need to retrain the baseline models, use the automated pipeline script. This will clean the raw data, isolate financial terminology, train the classifier, and export the `.pkl` files.

1. Activate your virtual environment.
2. Run the bash script:

```bash
bash run_pipeline.sh