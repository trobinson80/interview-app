import firebase_admin
from firebase_admin import credentials, auth, firestore
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Load service account key
cred = credentials.Certificate(os.getenv("FIREBASE_ADMIN_CREDENTIALS"))
firebase_admin.initialize_app(cred)

db = firestore.client()

def verify_token(id_token: str) -> str:
    try:
        decoded = auth.verify_id_token(id_token)
        return decoded["uid"]
    except Exception as e:
        raise Exception(f"Invalid Firebase token: {e}")
