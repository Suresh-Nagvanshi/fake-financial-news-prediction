#!/bin/bash

set -e

source venv/Scripts/activate

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