import pandas as pd
import re
from pathlib import Path

# Get project root folder
BASE_DIR = Path(__file__).resolve().parents[2]

# Dataset paths
fake_path = BASE_DIR / "data/raw/Fake.csv"
true_path = BASE_DIR / "data/raw/True.csv"

# Load datasets
fake = pd.read_csv(fake_path)
true = pd.read_csv(true_path)

# Add labels
fake["label"] = 0
true["label"] = 1

# Combine datasets
data = pd.concat([fake, true], ignore_index=True)

# Keep only useful columns
data = data[["title", "text", "label"]]

# Merge title and text
data["content"] = data["title"] + " " + data["text"]

# Text cleaning function
def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-Z ]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text

# Apply cleaning
data["content"] = data["content"].apply(clean_text)

# Keep only cleaned content and label
data = data[["content", "label"]]

# Save processed dataset
output_path = BASE_DIR / "data/processed/cleaned_news.csv"
data.to_csv(output_path, index=False)

print("Dataset processed and saved successfully!")
print("Total samples:", len(data))