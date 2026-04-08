from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="ALDSS AI Service", version="1.0.0")

@app.get("/health")
def health_check():
    return {"status": "ALDSS AI service running"}

@app.get("/compute-dqd/{user_id}")
def compute_dqd(user_id: str):
    # Placeholder — full implementation comes in Week 7
    return {
        "user_id": user_id,
        "dqd_index": 0.0,
        "message": "DQD computation not yet implemented"
    }