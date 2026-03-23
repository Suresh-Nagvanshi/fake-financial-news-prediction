#!/bin/bash

set -e

echo "======================================"
echo "Activating Virtual Environment..."
echo "======================================"

# Detect OS and activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

echo "======================================"
echo "Starting ML Pipeline Automation..."
echo "======================================"

echo "[1/4] Merging and Cleaning Raw Data..."
python backend/ml/preprocess.py

echo "[2/4] Isolating Financial Keywords..."
python backend/ml/filter_financial_news.py

echo "[3/4] Training Model & Exporting .pkl files..."
python backend/ml/financial_detector.py

echo "======================================"
echo "ML Pipeline Complete! Starting API..."
echo "======================================"

uvicorn backend.main:app --reload