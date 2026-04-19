from huggingface_hub import upload_folder

repo_id = "SureshNagvanshi/finverify-model"

upload_folder(
    folder_path="backend/models/distilbert_model",
    repo_id=repo_id,
    repo_type="model"
)

print("✅ Model uploaded successfully!")