#!/bin/bash

# Exit immediately if any command fails
set -e

echo "======================================"
echo "🚀 Starting ML Pipeline Automation..."
echo "======================================"

echo "\n[1/4] Merging and Cleaning Raw Data..."
python backend/ml/preprocess.py

echo "\n[2/4] Isolating Financial Keywords..."
python backend/ml/filter_financial_news.py

echo "\n[3/4] Training Model & Exporting .pkl files..."
python backend/ml/financial_detector.py

echo "\n======================================"
echo "✅ ML Pipeline Complete! Starting API..."
echo "======================================"

# Start the server
uvicorn backend.main:app --reload