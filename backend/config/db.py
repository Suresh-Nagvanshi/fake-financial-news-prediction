import os
from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path
try:
    # For Render
    from model.contact import Contact
except ModuleNotFoundError:
    # For Local
    from backend.model.contact import Contact

# 🔥 Load .env from ROOT (IMPORTANT FIX)
BASE_DIR = Path(__file__).resolve().parents[2]
env_path = BASE_DIR / ".env"

load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

print("MONGO_URI:", MONGO_URI)
print("DB_NAME:", DB_NAME)

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collection

contact_collection = db["contacts"]
user_collection = db["users"]
history_collection = db["history"]