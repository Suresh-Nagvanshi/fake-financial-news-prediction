import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments
)
from datasets import Dataset

# =========================
# 🔥 PATH SETUP (IMPORTANT)
# =========================
BASE_DIR = Path(__file__).resolve().parents[2]

data_path = BASE_DIR / "data" / "processed" / "financial_news.csv"

# 👉 Save EVERYTHING to D drive (no C drive issue)
OUTPUT_DIR = "D:/distilbert_training"
FINAL_MODEL_DIR = "D:/distilbert_model"

# =========================
# 📊 LOAD DATA
# =========================
df = pd.read_csv(data_path)
df = df.dropna(subset=['content', 'label'])

# =========================
# 🔀 TRAIN-TEST SPLIT
# =========================
train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

train_dataset = Dataset.from_pandas(train_df)
val_dataset = Dataset.from_pandas(val_df)

# =========================
# 🤖 LOAD MODEL + TOKENIZER
# =========================
model_name = "distilbert-base-uncased"

tokenizer = AutoTokenizer.from_pretrained(model_name)

def tokenize_function(examples):
    return tokenizer(
        examples["content"],
        padding="max_length",
        truncation=True,
        max_length=128
    )

train_dataset = train_dataset.map(tokenize_function, batched=True)
val_dataset = val_dataset.map(tokenize_function, batched=True)

model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    num_labels=2
)

# =========================
# ⚙️ TRAINING CONFIG
# =========================
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,   # 🔥 NOW IN D DRIVE
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    num_train_epochs=2,
    weight_decay=0.01,
    logging_dir="D:/distilbert_logs"
)

# =========================
# 🏋️ TRAINER
# =========================
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset
)

# =========================
# 🔥 TRAIN (WITH RESUME SUPPORT)
# =========================
try:
    trainer.train(resume_from_checkpoint=True)
except:
    print("⚠️ No checkpoint found, starting fresh training...")
    trainer.train()

# =========================
# 💾 SAVE FINAL MODEL
# =========================
print("💾 Saving final model to D drive...")

model.save_pretrained(FINAL_MODEL_DIR)
tokenizer.save_pretrained(FINAL_MODEL_DIR)

print("✅ Training complete and model saved successfully!")