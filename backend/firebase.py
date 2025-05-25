import os
import firebase_admin
from firebase_admin import credentials, auth, firestore
from dotenv import load_dotenv

# Load .env if running locally
load_dotenv()

# Get credential path from env variable
cred_path = os.getenv("FIREBASE_ADMIN_CREDENTIALS")

if not cred_path or not os.path.exists(cred_path):
    raise RuntimeError(f"❌ Missing or invalid FIREBASE_ADMIN_CREDENTIALS path: {cred_path}")

# Initialize Firebase app
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Token verification helper
def verify_token(id_token: str) -> str:
    try:
        decoded = auth.verify_id_token(id_token)
        return decoded["uid"]
    except Exception as e:
        raise Exception(f"Invalid Firebase token: {e}")
