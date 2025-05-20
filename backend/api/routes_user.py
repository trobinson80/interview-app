from fastapi import APIRouter, Request, HTTPException
from models.user import UserProfile
from firebase import verify_token, db

router = APIRouter()

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
