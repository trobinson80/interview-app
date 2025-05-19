from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes_user import router as user_router

app = FastAPI()

# Allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URLs in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/user")

@app.get("/")
def read_root():
    return {"msg": "FastAPI backend is live"}
