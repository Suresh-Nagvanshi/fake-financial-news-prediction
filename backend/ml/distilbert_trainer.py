from pathlib import Path

import numpy as np
import pandas as pd
from datasets import Dataset
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.model_selection import train_test_split
from transformers import (
    DataCollatorWithPadding,
    AutoModelForSequenceClassification,
    AutoTokenizer,
    Trainer,
    TrainingArguments,
)


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = BASE_DIR / "data" / "processed" / "financial_news.csv"
OUTPUT_DIR = BASE_DIR / "backend" / "models" / "training_outputs"
FINAL_MODEL_DIR = BASE_DIR / "backend" / "models" / "distilbert_model"
LOGGING_DIR = BASE_DIR / "backend" / "models" / "training_logs"

MODEL_NAME = "distilbert-base-uncased"
MAX_LENGTH = 96
LABEL_MAP = {0: "Fake", 1: "Real"}
LABEL_TO_ID = {label: idx for idx, label in LABEL_MAP.items()}


def tokenize_function(examples):
    return tokenizer(
        examples["content"],
        truncation=True,
        max_length=MAX_LENGTH,
    )


def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=1)
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels,
        predictions,
        average="binary",
        zero_division=0,
    )
    accuracy = accuracy_score(labels, predictions)
    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
    }


print(f"Loading dataset from: {DATA_PATH}")
df = pd.read_csv(DATA_PATH)
df = df.dropna(subset=["content", "label"]).copy()
df["label"] = df["label"].astype(int)

print("Label distribution:")
print(df["label"].value_counts().sort_index().to_string())

train_df, val_df = train_test_split(
    df,
    test_size=0.2,
    random_state=42,
    stratify=df["label"],
)

train_dataset = Dataset.from_pandas(train_df.reset_index(drop=True))
val_dataset = Dataset.from_pandas(val_df.reset_index(drop=True))

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

train_dataset = train_dataset.map(tokenize_function, batched=True)
val_dataset = val_dataset.map(tokenize_function, batched=True)

columns_to_keep = ["input_ids", "attention_mask", "label"]
train_dataset = train_dataset.remove_columns(
    [column for column in train_dataset.column_names if column not in columns_to_keep]
)
val_dataset = val_dataset.remove_columns(
    [column for column in val_dataset.column_names if column not in columns_to_keep]
)

train_dataset.set_format("torch")
val_dataset.set_format("torch")

model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=2,
    id2label=LABEL_MAP,
    label2id=LABEL_TO_ID,
)

training_args = TrainingArguments(
    output_dir=str(OUTPUT_DIR),
    learning_rate=2e-5,
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    gradient_accumulation_steps=4,
    num_train_epochs=3,
    weight_decay=0.01,
    do_train=True,
    do_eval=True,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="f1",
    greater_is_better=True,
    logging_dir=str(LOGGING_DIR),
    logging_strategy="epoch",
    report_to="none",
    dataloader_pin_memory=False,
)

trainer = Trainer(
    model=model,
    args=training_args,
    data_collator=data_collator,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    processing_class=tokenizer,
    compute_metrics=compute_metrics,
)

print("Starting training...")
train_result = trainer.train()

print("Evaluating best checkpoint...")
eval_metrics = trainer.evaluate()

FINAL_MODEL_DIR.mkdir(parents=True, exist_ok=True)
trainer.save_model(str(FINAL_MODEL_DIR))
tokenizer.save_pretrained(str(FINAL_MODEL_DIR))

print("\nTraining complete.")
print("Train metrics:")
print(train_result.metrics)
print("\nValidation metrics:")
print(eval_metrics)
print(f"\nBest model saved to: {FINAL_MODEL_DIR}")
