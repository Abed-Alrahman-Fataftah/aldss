import json
from database import query_df, execute
from features import compute_dqd_index
from datetime import datetime

def get_all_active_users() -> list:
    df = query_df("""
        SELECT id, "fullName", "group", "enrolledAt"
        FROM "User"
        WHERE "isActive" = true
    """)
    return df.to_dict("records")

def get_current_week_number(user_id: str) -> int:
    df = query_df("""
        SELECT "enrolledAt" FROM "User" WHERE id = :user_id
    """, {"user_id": user_id})
    
    if len(df) == 0:
        return 1
    
    enrolled_at = df.iloc[0]["enrolledAt"]
    days_enrolled = (datetime.now() - enrolled_at.replace(tzinfo=None)).days
    return max(1, days_enrolled // 7 + 1)

def snapshot_already_exists(user_id: str, week_number: int) -> bool:
    df = query_df("""
        SELECT id FROM "DQDSnapshot"
        WHERE "userId" = :user_id AND "weekNumber" = :week_number
    """, {"user_id": user_id, "week_number": week_number})
    return len(df) > 0

def classify_trajectory(dqd_history: list) -> str:
    if len(dqd_history) < 2:
        return "STAGNATING"
    
    recent = dqd_history[-3:] if len(dqd_history) >= 3 else dqd_history
    
    if len(recent) < 2:
        return "STAGNATING"
    
    trend = recent[-1] - recent[0]
    
    if trend < -0.05:
        return "IMPROVING"   # DQD going down = improving
    elif trend > 0.05:
        return "DECLINING"   # DQD going up = declining
    else:
        return "STAGNATING"

def get_dqd_history(user_id: str) -> list:
    df = query_df("""
        SELECT "dqdIndex" FROM "DQDSnapshot"
        WHERE "userId" = :user_id
        ORDER BY "weekNumber" ASC
    """, {"user_id": user_id})
    return df["dqdIndex"].tolist() if len(df) > 0 else []

def compute_dropout_risk(dqd_index: float, trajectory: str, days_since_last: float) -> float:
    base_risk = dqd_index
    
    if trajectory == "DECLINING":
        base_risk += 0.15
    elif trajectory == "STAGNATING":
        base_risk += 0.05
    
    if days_since_last > 7:
        base_risk += 0.20
    elif days_since_last > 4:
        base_risk += 0.10
    
    return round(min(base_risk, 1.0), 4)

def get_days_since_last_session(user_id: str) -> float:
    df = query_df("""
        SELECT "startedAt" FROM "Session"
        WHERE "userId" = :user_id
        ORDER BY "startedAt" DESC
        LIMIT 1
    """, {"user_id": user_id})
    
    if len(df) == 0:
        return 999.0
    
    last_session = df.iloc[0]["startedAt"]
    return (datetime.now() - last_session.replace(tzinfo=None)).days

def write_snapshot(user_id: str, week_number: int, result: dict, trajectory: str, dropout_risk: float):
    from sqlalchemy import text
    from database import engine
    import uuid

    with engine.connect() as conn:
        conn.execute(text("""
            INSERT INTO "DQDSnapshot" 
            (id, "userId", "weekNumber", "dqdIndex", "consistencyScore", 
             "dropoutRisk", "trajectoryType", "featureVector", "computedAt")
            VALUES (
                :id,
                :user_id,
                :week_number,
                :dqd_index,
                :consistency_score,
                :dropout_risk,
                :trajectory_type,
                CAST(:feature_vector AS jsonb),
                NOW()
            )
        """), {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "week_number": week_number,
            "dqd_index": float(result["dqd_index"]),
            "consistency_score": float(round(1.0 - result["features"]["f1_session_regularity"], 4)),
            "dropout_risk": float(dropout_risk),
            "trajectory_type": trajectory,
            "feature_vector": json.dumps(result["features"])
        })
        conn.commit()

def run_weekly_computation(force: bool = False) -> dict:
    users = get_all_active_users()
    results = []
    
    print(f"Computing DQD for {len(users)} active participants...")
    
    for user in users:
        user_id = user["id"]
        week_number = get_current_week_number(user_id)
        
        if not force and snapshot_already_exists(user_id, week_number):
            print(f"  Skipping {user['fullName']} — week {week_number} already computed")
            continue
        
        try:
            result = compute_dqd_index(user_id, week_number)
            dqd_history = get_dqd_history(user_id)
            dqd_history.append(result["dqd_index"])
            trajectory = classify_trajectory(dqd_history)
            days_since = get_days_since_last_session(user_id)
            dropout_risk = compute_dropout_risk(result["dqd_index"], trajectory, days_since)
            
            write_snapshot(user_id, week_number, result, trajectory, dropout_risk)
            
            results.append({
                "user_id": user_id,
                "name": user["fullName"],
                "group": user["group"],
                "week": week_number,
                "dqd_index": result["dqd_index"],
                "trajectory": trajectory,
                "dropout_risk": dropout_risk,
                "features": result["features"]
            })
            
            print(f"  {user['fullName']}: DQD={result['dqd_index']} | {trajectory} | risk={dropout_risk}")
            
        except Exception as e:
            print(f"  Error processing {user['fullName']}: {e}")
            import traceback
            traceback.print_exc()
    
    return {
        "computed": len(results),
        "skipped": len(users) - len(results),
        "results": results
    }