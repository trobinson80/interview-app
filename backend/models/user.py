from pydantic import BaseModel
from typing import List

class UserProfile(BaseModel):
    name: str
    email: str
    experience: str  # '0-2', '3-6', etc.
    goal: str
    tracks: List[str]  # e.g. ['System Design', 'Behavioral']
