import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth, firestore

# Load local .env file if present
load_dotenv()

# Read and validate credentials path
cred_path = os.environ.get("FIREBASE_ADMIN_CREDENTIALS")
if not cred_path or not os.path.exists(cred_path):
    raise RuntimeError(f"❌ FIREBASE_ADMIN_CREDENTIALS is missing or invalid: {cred_path}")

# Initialize Firebase
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

def verify_token(id_token: str) -> str:
    try:
        decoded = auth.verify_id_token(id_token)
        return decoded["uid"]
    except Exception as e:
        raise Exception(f"Invalid Firebase token: {e}")