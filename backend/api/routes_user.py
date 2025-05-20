from fastapi import APIRouter, Request, HTTPException
from models.user import UserProfile
from firebase import verify_token, db
import os
import json
from feedback_loop import evaluate_response
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()
QUESTIONS_FILE = os.path.join(os.path.dirname(__file__), '../behavoiral_questions.json')

class AnswerSubmission(BaseModel):
    question: str
    answer: str

def get_uid(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        print("[Auth] ❌ Missing Authorization header")
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    try:
        uid = verify_token(token)
        print(f"[Auth] ✅ Token verified for UID: {uid}")
        return uid
    except Exception as e:
        print(f"[Auth] ❌ Token verification failed: {e}")
        raise HTTPException(status_code=403, detail="Invalid token")

@router.get("/profile")
def get_profile(request: Request):
    uid = get_uid(request)
    print(f"[GET /profile] Fetching profile for UID: {uid}")
    
    doc_ref = db.collection("user_profiles").document(uid)
    doc = doc_ref.get()
    
    if doc.exists:
        data = doc.to_dict()
        print(f"[GET /profile] Found profile: {data}")
        return data
    else:
        print(f"[GET /profile] No profile found, returning default")
        return UserProfile(
            name="",
            email="",
            experience="",
            goal="",
            tracks=[]
        )

@router.post("/profile")
def update_profile(profile: UserProfile, request: Request):
    uid = get_uid(request)
    print(f"[POST /profile] Updating profile for UID: {uid}")
    print(f"[POST /profile] Data: {profile}")
    
    doc_ref = db.collection("user_profiles").document(uid)
    doc_ref.set(profile.dict())
    
    return { "status": "updated" }

@router.get("/question")
def get_behavioral_question(request: Request):
    print("behavoiral@@@")
    uid = get_uid(request)

    # Load all questions
    with open(QUESTIONS_FILE, 'r') as f:
        all_questions = json.load(f)
    all_questions = all_questions["behavioral_questions"]
    # Get list of questions user has already seen
    seen_docs = db.collection('users').document(uid).collection('behavioral_answers').stream()
    seen_questions = set(doc.id for doc in seen_docs)

    # Find first unseen question
    for q in all_questions:
        if q["id"] not in seen_questions:
            return { "question": q["question"], "id": q["id"] }

    raise HTTPException(status_code=404, detail="No more unseen questions available")

@router.post("/answer")
def submit_behavioral_answer(data: AnswerSubmission, request: Request):
    uid = verify_token(request.headers.get("Authorization"))

    print(f"[POST /answer] UID: {uid}, Question: {data.question}")
    feedback = evaluate_response(data.answer)

    # Optionally save the answer and feedback to Firestore
    db.collection("users").document(uid).collection("behavioral_answers").document(data.question).set({
        "question": data.question,
        "answer": data.answer,
        "feedback": feedback,
        "timestamp": datetime.utcnow()
    })
    print(feedback)
    return { "feedback": feedback }