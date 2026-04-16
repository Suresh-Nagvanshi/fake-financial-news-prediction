from __future__ import annotations

import argparse
import json
from pathlib import Path

from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    pipeline,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Export a Hugging Face training checkpoint into a clean inference folder "
            "that is ready to share and load with pipeline()."
        )
    )
    parser.add_argument(
        "checkpoint_path",
        help="Path to the Hugging Face checkpoint directory, for example checkpoint-500.",
    )
    parser.add_argument(
        "--output-dir",
        default="distilbert_model",
        help="Directory where the clean model folder will be saved.",
    )
    parser.add_argument(
        "--tokenizer-source",
        default="distilbert-base-uncased",
        help=(
            "Fallback tokenizer source if tokenizer files are missing in the checkpoint. "
            "For this project, distilbert-base-uncased matches the training script."
        ),
    )
    parser.add_argument(
        "--test-text",
        default="Company earnings beat analyst expectations and guidance was raised.",
        help="Sample text used only when --verify is passed.",
    )
    parser.add_argument(
        "--verify",
        action="store_true",
        help="Run a quick pipeline() test after export.",
    )
    return parser.parse_args()


def load_tokenizer(checkpoint_path: Path, tokenizer_source: str):
    try:
        print(f"Loading tokenizer from checkpoint: {checkpoint_path}")
        return AutoTokenizer.from_pretrained(checkpoint_path)
    except Exception as exc:
        print(
            "Tokenizer files were not found in the checkpoint. "
            f"Falling back to tokenizer source: {tokenizer_source}"
        )
        print(f"Tokenizer fallback reason: {exc}")
        return AutoTokenizer.from_pretrained(tokenizer_source)


def write_additional_tokenizer_files(tokenizer, output_dir: Path) -> None:
    special_tokens_map_path = output_dir / "special_tokens_map.json"
    if not special_tokens_map_path.exists():
        special_tokens_map_path.write_text(
            json.dumps(tokenizer.special_tokens_map, indent=2) + "\n",
            encoding="utf-8",
        )

    vocab_path = output_dir / "vocab.txt"
    if vocab_path.exists():
        return

    if not hasattr(tokenizer, "get_vocab"):
        return

    vocab = tokenizer.get_vocab()
    if not vocab:
        return

    ordered_tokens = [token for token, _ in sorted(vocab.items(), key=lambda item: item[1])]
    vocab_path.write_text("\n".join(ordered_tokens) + "\n", encoding="utf-8")


def export_checkpoint(checkpoint_path: Path, output_dir: Path, tokenizer_source: str) -> None:
    print(f"Loading model from checkpoint: {checkpoint_path}")
    model = AutoModelForSequenceClassification.from_pretrained(checkpoint_path)

    tokenizer = load_tokenizer(checkpoint_path, tokenizer_source)

    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Saving clean model files to: {output_dir}")
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    write_additional_tokenizer_files(tokenizer, output_dir)

    print("\nExport complete.")
    print(f"Clean model folder saved at: {output_dir.resolve()}")
    print("Expected shareable files include:")
    print("- config.json")
    print("- model.safetensors (or pytorch_model.bin)")
    print("- tokenizer.json")
    print("- tokenizer_config.json")
    print("- vocab.txt")
    print("- special_tokens_map.json")
    print("\nTraining-only files such as optimizer.pt and trainer_state.json were not copied.")


def verify_export(output_dir: Path, test_text: str) -> None:
    print("\nRunning pipeline() verification...")
    classifier = pipeline(
        "text-classification",
        model=str(output_dir),
        tokenizer=str(output_dir),
    )
    result = classifier(test_text)
    print("Verification successful.")
    print(f"Sample input: {test_text}")
    print(f"Pipeline output: {result}")


def main() -> None:
    args = parse_args()
    checkpoint_path = Path(args.checkpoint_path).expanduser().resolve()
    output_dir = Path(args.output_dir).expanduser().resolve()

    if not checkpoint_path.exists():
        raise FileNotFoundError(f"Checkpoint path does not exist: {checkpoint_path}")
    if not checkpoint_path.is_dir():
        raise NotADirectoryError(f"Checkpoint path is not a directory: {checkpoint_path}")

    export_checkpoint(checkpoint_path, output_dir, args.tokenizer_source)

    if args.verify:
        verify_export(output_dir, args.test_text)

    print("\nUse the exported folder with pipeline() like this:")
    print(
        f'pipeline("text-classification", model=r"{output_dir}", tokenizer=r"{output_dir}")'
    )


if __name__ == "__main__":
    main()
