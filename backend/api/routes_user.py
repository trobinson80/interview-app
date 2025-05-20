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
    session_id: str
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
    uid = get_uid(request)

    with open(QUESTIONS_FILE, 'r') as f:
        all_questions = json.load(f)["behavioral_questions"]

    seen_docs = db.collection('users').document(uid).collection('behavioral_answers').stream()
    seen_questions = set(doc.id for doc in seen_docs)

    for q in all_questions:
        if q["id"] not in seen_questions:
            question_id = q["id"]
            session_doc = db.collection("users").document(uid).collection("behavioral_sessions").document()
            session_doc.set({
                "question_id": question_id,
                "question": q["question"],
                "timestamp": datetime.utcnow().isoformat(),
                "status": "in_progress"
            })
            return {
                "question": q["question"],
                "id": question_id,
                "session_id": session_doc.id
            }

    raise HTTPException(status_code=404, detail="No more unseen questions available")


@router.post("/answer")
def handle_behavioral_answer(payload: AnswerSubmission, request: Request):
    uid = get_uid(request)

    print(f"[POST /behavioral/answer] User: {uid}")
    print(f"[POST /behavioral/answer] Question: {payload.question}")
    
    feedback = evaluate_response(payload.question, payload.answer)
    print(f"[POST /behavioral/answer] Feedback generated.")

    # Compute overall clarity and completeness
    star_keys = ['situation', 'task', 'action', 'result']
    overall_clarity = sum(float(feedback[k]['clarity_score']) for k in star_keys) / len(star_keys)
    overall_completeness = sum(float(feedback[k]['completeness_score']) for k in star_keys) / len(star_keys)

    session_data = {
        "question": payload.question,
        "answer": payload.answer,
        "feedback": feedback,
        "timestamp": datetime.utcnow().isoformat(),
        "situation_clarity": feedback['situation']['clarity_score'],
        "situation_completeness": feedback['situation']['completeness_score'],
        "task_clarity": feedback['task']['clarity_score'],
        "task_completeness": feedback['task']['completeness_score'],
        "action_clarity": feedback['action']['clarity_score'],
        "action_completeness": feedback['action']['completeness_score'],
        "result_clarity": feedback['result']['clarity_score'],
        "result_completeness": feedback['result']['completeness_score'],
        "overall_clarity": round(overall_clarity, 2),
        "overall_completeness": round(overall_completeness, 2),
        "status": "completed"
    }

    # Update session document
    session_ref = db.collection("users").document(uid).collection("behavioral_sessions").document(payload.session_id)
    session_ref.set(session_data, merge=True)

    # Optional: Also store in legacy collection
    db.collection("users").document(uid).collection("behavioral_answers").document(payload.session_id).set(session_data)

    return feedback