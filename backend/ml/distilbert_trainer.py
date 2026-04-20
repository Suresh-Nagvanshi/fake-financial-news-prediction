import os

os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

from pathlib import Path
import json
import random

import numpy as np
import pandas as pd
import torch
from datasets import Dataset
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    classification_report,
)
from sklearn.model_selection import train_test_split
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    DataCollatorWithPadding,
    Trainer,
    TrainingArguments,
    set_seed,
)

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = BASE_DIR / "data" / "processed" / "financial_news.csv"
OUTPUT_DIR = BASE_DIR / "backend" / "models" / "training_outputs_cpu"
FINAL_MODEL_DIR = BASE_DIR / "backend" / "models" / "distilbert_model_cpu"
LOGGING_DIR = BASE_DIR / "backend" / "models" / "training_logs_cpu"
THRESHOLD_FILE = FINAL_MODEL_DIR / "threshold_config.json"

MODEL_NAME = "distilbert-base-uncased"
MAX_LENGTH = 64
SEED = 42

TRAIN_SAMPLE_LIMIT = 3000
VAL_SAMPLE_LIMIT = 800

NUM_EPOCHS = 1
LEARNING_RATE = 2e-5
TRAIN_BATCH_SIZE = 2
EVAL_BATCH_SIZE = 2
GRAD_ACCUM_STEPS = 1

LABEL_MAP = {0: "Fake", 1: "Real"}
LABEL_TO_ID = {"Fake": 0, "Real": 1}
FAKE_LABEL_ID = 0
REAL_LABEL_ID = 1

tokenizer = None


def set_cpu_threads():
    torch.set_num_threads(1)
    if hasattr(torch, "set_num_interop_threads"):
        torch.set_num_interop_threads(1)


def freeze_lower_layers(model, freeze_embeddings=True, freeze_n_layers=4):
    if freeze_embeddings:
        model.distilbert.embeddings.requires_grad_(False)

    for layer in model.distilbert.transformer.layer[:freeze_n_layers]:
        for param in layer.parameters():
            param.requires_grad = False


def tokenize_function(examples):
    return tokenizer(
        examples["content"],
        truncation=True,
        max_length=MAX_LENGTH,
    )


def softmax(logits):
    logits = np.array(logits)
    logits = logits - np.max(logits, axis=1, keepdims=True)
    exp_vals = np.exp(logits)
    return exp_vals / np.sum(exp_vals, axis=1, keepdims=True)


def compute_class_metrics(labels, predictions):
    precision, recall, f1, support = precision_recall_fscore_support(
        labels,
        predictions,
        labels=[FAKE_LABEL_ID, REAL_LABEL_ID],
        average=None,
        zero_division=0,
    )

    macro_p, macro_r, macro_f1, _ = precision_recall_fscore_support(
        labels,
        predictions,
        average="macro",
        zero_division=0,
    )

    cm = confusion_matrix(labels, predictions, labels=[FAKE_LABEL_ID, REAL_LABEL_ID])

    return {
        "accuracy": accuracy_score(labels, predictions),
        "macro_precision": macro_p,
        "macro_recall": macro_r,
        "macro_f1": macro_f1,
        "fake_precision": precision[0],
        "fake_recall": recall[0],
        "fake_f1": f1[0],
        "fake_support": int(support[0]),
        "real_precision": precision[1],
        "real_recall": recall[1],
        "real_f1": f1[1],
        "real_support": int(support[1]),
        "confusion_matrix": cm.tolist(),
    }


def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=1)
    metrics = compute_class_metrics(labels, predictions)

    return {
        "accuracy": metrics["accuracy"],
        "macro_precision": metrics["macro_precision"],
        "macro_recall": metrics["macro_recall"],
        "macro_f1": metrics["macro_f1"],
        "fake_precision": metrics["fake_precision"],
        "fake_recall": metrics["fake_recall"],
        "fake_f1": metrics["fake_f1"],
        "real_precision": metrics["real_precision"],
        "real_recall": metrics["real_recall"],
        "real_f1": metrics["real_f1"],
    }


def find_best_fake_threshold(logits, labels):
    probs = softmax(logits)
    fake_probs = probs[:, FAKE_LABEL_ID]

    best_threshold = 0.50
    best_fake_f1 = -1.0
    best_predictions = None
    best_metrics = None

    for threshold in np.arange(0.40, 0.81, 0.02):
        predictions = np.where(fake_probs >= threshold, FAKE_LABEL_ID, REAL_LABEL_ID)
        metrics = compute_class_metrics(labels, predictions)

        if metrics["fake_f1"] > best_fake_f1:
            best_fake_f1 = metrics["fake_f1"]
            best_threshold = float(round(threshold, 2))
            best_predictions = predictions
            best_metrics = metrics

    return best_threshold, best_predictions, best_metrics


def balanced_sample(df, limit):
    if limit is None or len(df) <= limit:
        return df.copy()

    per_class = max(limit // 2, 1)
    parts = []

    for label_value in sorted(df["label"].unique()):
        class_df = df[df["label"] == label_value]
        take_n = min(len(class_df), per_class)
        parts.append(class_df.sample(n=take_n, random_state=SEED))

    sampled = pd.concat(parts).sample(frac=1, random_state=SEED).reset_index(drop=True)
    return sampled


def main():
    global tokenizer

    set_seed(SEED)
    random.seed(SEED)
    np.random.seed(SEED)
    set_cpu_threads()

    print(f"Loading dataset from: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=["content", "label"]).copy()
    df["label"] = df["label"].astype(int)
    df["content"] = df["content"].astype(str).str.slice(0, 512)

    print("\nOriginal label distribution:")
    print(df["label"].value_counts().sort_index().rename(index=LABEL_MAP).to_string())

    train_df, val_df = train_test_split(
        df,
        test_size=0.2,
        random_state=SEED,
        stratify=df["label"],
    )

    train_df = balanced_sample(train_df, TRAIN_SAMPLE_LIMIT)
    val_df = balanced_sample(val_df, VAL_SAMPLE_LIMIT)

    print("\nCPU-safe sampled train distribution:")
    print(train_df["label"].value_counts().sort_index().rename(index=LABEL_MAP).to_string())

    print("\nCPU-safe sampled validation distribution:")
    print(val_df["label"].value_counts().sort_index().rename(index=LABEL_MAP).to_string())

    train_dataset = Dataset.from_pandas(train_df.reset_index(drop=True))
    val_dataset = Dataset.from_pandas(val_df.reset_index(drop=True))

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

    train_dataset = train_dataset.map(tokenize_function, batched=True)
    val_dataset = val_dataset.map(tokenize_function, batched=True)

    columns_to_keep = ["input_ids", "attention_mask", "label"]

    train_dataset = train_dataset.remove_columns(
        [col for col in train_dataset.column_names if col not in columns_to_keep]
    )
    val_dataset = val_dataset.remove_columns(
        [col for col in val_dataset.column_names if col not in columns_to_keep]
    )

    train_dataset.set_format("torch")
    val_dataset.set_format("torch")

    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=2,
        id2label=LABEL_MAP,
        label2id=LABEL_TO_ID,
    )

    freeze_lower_layers(model, freeze_embeddings=True, freeze_n_layers=4)

    training_args = TrainingArguments(
        output_dir=str(OUTPUT_DIR),
        learning_rate=LEARNING_RATE,
        per_device_train_batch_size=TRAIN_BATCH_SIZE,
        per_device_eval_batch_size=EVAL_BATCH_SIZE,
        gradient_accumulation_steps=GRAD_ACCUM_STEPS,
        num_train_epochs=NUM_EPOCHS,
        weight_decay=0.01,
        do_train=True,
        do_eval=True,
        eval_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="eval_macro_f1",
        greater_is_better=True,
        logging_dir=str(LOGGING_DIR),
        logging_strategy="epoch",
        report_to="none",
        dataloader_num_workers=0,
        dataloader_pin_memory=False,
        save_total_limit=1,
        remove_unused_columns=True,
        fp16=False,
        bf16=False,
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

    print("\nStarting CPU-safe training...")
    train_result = trainer.train()

    print("\nEvaluating best checkpoint with argmax...")
    eval_metrics = trainer.evaluate()

    print("\nRunning threshold tuning for Fake class...")
    pred_output = trainer.predict(val_dataset)
    val_logits = pred_output.predictions
    val_labels = pred_output.label_ids

    best_threshold, tuned_predictions, tuned_metrics = find_best_fake_threshold(
        val_logits,
        val_labels,
    )

    print(f"\nBest fake threshold: {best_threshold}")
    print("\nTuned metrics:")
    print(json.dumps(tuned_metrics, indent=2))

    print("\nClassification report at tuned threshold:")
    print(
        classification_report(
            val_labels,
            tuned_predictions,
            target_names=["Fake", "Real"],
            zero_division=0,
        )
    )

    FINAL_MODEL_DIR.mkdir(parents=True, exist_ok=True)
    trainer.save_model(str(FINAL_MODEL_DIR))
    tokenizer.save_pretrained(str(FINAL_MODEL_DIR))

    with open(THRESHOLD_FILE, "w", encoding="utf-8") as f:
        json.dump(
            {
                "fake_threshold": best_threshold,
                "label_map": LABEL_MAP,
                "max_length": MAX_LENGTH,
                "cpu_safe": True,
                "train_sample_limit": TRAIN_SAMPLE_LIMIT,
                "val_sample_limit": VAL_SAMPLE_LIMIT,
            },
            f,
            indent=2,
        )

    print("\nTraining complete.")
    print("\nTrain metrics:")
    print(train_result.metrics)

    print("\nValidation metrics (argmax):")
    print(eval_metrics)

    print(f"\nBest model saved to: {FINAL_MODEL_DIR}")
    print(f"Threshold config saved to: {THRESHOLD_FILE}")


if __name__ == "__main__":
    main()