import pandas as pd
from pathlib import Path

# Project root
BASE_DIR = Path(__file__).resolve().parents[2]

# Load cleaned dataset
data_path = BASE_DIR / "data/processed/cleaned_news.csv"
df = pd.read_csv(data_path)

# Financial keywords
keywords = [
    "stock","market","bank","finance","crypto","bitcoin","economy",
    "inflation","interest","investment","trading","shares","currency",
    "federal","rbi","nasdaq","dow"
]

# Filter financial news
financial_news = df[df["content"].str.contains("|".join(keywords), case=False, na=False)]

# Save dataset
output_path = BASE_DIR / "data/processed/financial_news.csv"
financial_news.to_csv(output_path, index=False)

print("Financial news dataset created!")
print("Total financial articles:", len(financial_news))