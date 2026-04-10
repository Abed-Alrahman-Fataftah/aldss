from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database import test_connection
from features import compute_dqd_index
from snapshots import run_weekly_computation, get_all_active_users, get_current_week_number
import uvicorn
from interventions import (
    run_intervention_check,
    get_pending_intervention,
    acknowledge_intervention
)

load_dotenv()

app = FastAPI(title="ALDSS AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    db_ok = test_connection()
    return {
        "status": "running",
        "database": "connected" if db_ok else "disconnected"
    }

@app.get("/compute-dqd/{user_id}")
def compute_single_dqd(user_id: str, week: int = None):
    """Compute DQD for a single user — for testing and on-demand computation"""
    try:
        from snapshots import get_current_week_number
        week_number = week or get_current_week_number(user_id)
        result = compute_dqd_index(user_id, week_number)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/run-weekly")
def run_weekly(force: bool = False):
    """
    Compute DQD snapshots for all active participants.
    Call this once per week — or force=true to recompute.
    """
    try:
        result = run_weekly_computation(force=force)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/participants-summary")
def participants_summary():
    """Get a quick summary of all participants and their latest DQD"""
    try:
        from database import query_df
        df = query_df("""
            SELECT 
                u."fullName",
                u."group",
                u."enrolledAt",
                s."dqdIndex",
                s."trajectoryType",
                s."dropoutRisk",
                s."weekNumber",
                s."computedAt"
            FROM "User" u
            LEFT JOIN LATERAL (
                SELECT * FROM "DQDSnapshot"
                WHERE "userId" = u.id
                ORDER BY "weekNumber" DESC
                LIMIT 1
            ) s ON true
            WHERE u."isActive" = true
            ORDER BY s."dqdIndex" DESC NULLS LAST
        """)
        return df.to_dict("records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/run-interventions")
def run_interventions():
    """
    Check all intervention group participants and deliver
    guidance cards to those above the DQD threshold.
    """
    try:
        result = run_intervention_check()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/pending-intervention/{user_id}")
def get_pending(user_id: str):
    """Check if a user has a pending guidance card to display."""
    try:
        intervention = get_pending_intervention(user_id)
        return {"intervention": intervention}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/acknowledge-intervention/{intervention_id}")
def acknowledge(
    intervention_id: str,
    accepted: bool = True,
    rating: int = None
):
    """Record participant response to an intervention."""
    try:
        acknowledge_intervention(intervention_id, accepted, rating)
        return {"acknowledged": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/run-full-pipeline")
def run_full_pipeline(force: bool = False):
    """
    Run the complete weekly pipeline:
    1. Compute DQD for all participants
    2. Check and deliver interventions
    """
    try:
        dqd_result = run_weekly_computation(force=force)
        intervention_result = run_intervention_check()
        return {
            "dqd": dqd_result,
            "interventions": intervention_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)