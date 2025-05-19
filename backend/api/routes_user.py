from fastapi import APIRouter, Request, HTTPException
from models.user import UserProfile
from firebase import verify_token

router = APIRouter()
user_store = {}

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
    if uid not in user_store:
        print(f"[GET /profile] No existing profile, returning default for {uid}")
        return UserProfile(
            name="",
            email="",
            experience="",
            goal="",
            tracks=[]
        )
    print(f"[GET /profile] Found profile for {uid}: {user_store[uid]}")
    return user_store[uid]

@router.post("/profile")
def update_profile(profile: UserProfile, request: Request):
    uid = get_uid(request)
    print(f"[POST /profile] Updating profile for UID: {uid}")
    print(f"[POST /profile] Data: {profile}")
    user_store[uid] = profile
    return { "status": "updated" }
