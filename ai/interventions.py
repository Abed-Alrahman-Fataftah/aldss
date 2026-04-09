import json
from database import query_df, execute
from explainer import generate_guidance_message
from typing import Optional

# DQD threshold that triggers an intervention
DQD_THRESHOLD = 0.60
CONSECUTIVE_WEEKS_REQUIRED = 2

def get_latest_snapshots(user_id: str, limit: int = 3) -> list:
    from sqlalchemy import text
    from database import engine

    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT 
                id,
                "dqdIndex",
                "trajectoryType",
                "dropoutRisk",
                "weekNumber",
                "featureVector",
                "computedAt"
            FROM "DQDSnapshot"
            WHERE "userId" = :user_id
            ORDER BY "weekNumber" DESC
            LIMIT :limit
        """), {"user_id": user_id, "limit": limit})
        rows = result.fetchall()
        columns = result.keys()

    return [dict(zip(columns, row)) for row in rows]
def intervention_already_sent_this_week(user_id: str, week_number: int) -> bool:
    from sqlalchemy import text
    from database import engine

    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT id FROM "Intervention"
            WHERE "userId" = :user_id
            AND "triggeredAt" >= NOW() - INTERVAL '7 days'
        """), {"user_id": user_id})
        rows = result.fetchall()

    return len(rows) > 0

def should_trigger_intervention(snapshots: list) -> bool:
    if not snapshots:
        return False
    
    latest_dqd = float(snapshots[0].get("dqdIndex") or 0)
    
    print(f"    trigger check: latest={latest_dqd:.2f} threshold={DQD_THRESHOLD}")
    
    # Trigger if latest snapshot is above threshold
    if latest_dqd >= DQD_THRESHOLD:
        return True
    
    return False
def get_user_info(user_id: str) -> dict:
    df = query_df("""
        SELECT "fullName", "group" FROM "User" WHERE id = :user_id
    """, {"user_id": user_id})
    return df.to_dict("records")[0] if len(df) > 0 else {}

def get_latest_dqd_snapshot_id(user_id: str) -> Optional[str]:
    df = query_df("""
        SELECT id FROM "DQDSnapshot"
        WHERE "userId" = :user_id
        ORDER BY "weekNumber" DESC
        LIMIT 1
    """, {"user_id": user_id})
    return df.iloc[0]["id"] if len(df) > 0 else None

def write_intervention(
    user_id: str,
    snapshot_id: str,
    guidance_text: str,
    explanation_text: str
) -> str:
    from sqlalchemy import text
    from database import engine
    import uuid

    intervention_id = str(uuid.uuid4())

    with engine.connect() as conn:
        conn.execute(text("""
            INSERT INTO "Intervention"
            (id, "userId", "dqdSnapshotId", "guidanceText", "explanationText", "dismissed", "triggeredAt")
            VALUES (
                :id,
                :user_id,
                :snapshot_id,
                :guidance_text,
                :explanation_text,
                false,
                NOW()
            )
        """), {
            "id": intervention_id,
            "user_id": user_id,
            "snapshot_id": snapshot_id,
            "guidance_text": guidance_text,
            "explanation_text": explanation_text
        })
        conn.commit()

    return intervention_id

def run_intervention_check() -> dict:
    """
    Check all INTERVENTION group participants.
    Deliver guidance to those whose DQD triggers the threshold.
    Only runs for INTERVENTION group — control group never receives guidance.
    """
    intervention_users = query_df("""
        SELECT id, "fullName" FROM "User"
        WHERE "group" = 'INTERVENTION'
        AND "isActive" = true
    """)
    
    delivered = []
    skipped = []
    
    print(f"Checking {len(intervention_users)} intervention group participants...")
    
    for _, user in intervention_users.iterrows():
        user_id = user["id"]
        user_name = user["fullName"]
        
        snapshots = get_latest_snapshots(user_id)
        
        if not snapshots:
            reason = "no snapshots yet"
            print(f"  Skipping {user_name}: {reason}")
            skipped.append({"user": user_name, "reason": reason})
            continue
        
        print(f"  {user_name} — latest DQD: {snapshots[0]['dqdIndex']:.2f}, snapshots found: {len(snapshots)}")
        
        if intervention_already_sent_this_week(user_id, snapshots[0].get("weekNumber", 1)):
            reason = "already received intervention this week"
            print(f"  Skipping {user_name}: {reason}")
            skipped.append({"user": user_name, "reason": reason})
            continue
        
        if not should_trigger_intervention(snapshots):
            reason = f"DQD {snapshots[0]['dqdIndex']:.2f} below threshold {DQD_THRESHOLD}"
            print(f"  Skipping {user_name}: {reason}")
            skipped.append({"user": user_name, "reason": reason})
            continue
        
        # Generate intervention
        latest = snapshots[0]
        features = json.loads(latest["featureVector"]) if isinstance(latest["featureVector"], str) else latest["featureVector"]
        
        weights = {
            "f1_session_regularity": 0.20,
            "f2_content_depth": 0.18,
            "f3_path_switch_rate": 0.17,
            "f4_quiz_recovery": 0.14,
            "f5_return_velocity": 0.13,
            "f6_idle_ratio": 0.10,
            "f7_goal_modification": 0.05,
            "f8_perceived_actual_gap": 0.03
        }
        
        message = generate_guidance_message(
            dqd_index=latest["dqdIndex"],
            features=features,
            weights=weights,
            trajectory=latest["trajectoryType"] or "STAGNATING",
            participant_name=user_name
        )
        
        snapshot_id = get_latest_dqd_snapshot_id(user_id)
        if not snapshot_id:
            print(f"  Skipping {user_name}: no latest DQD snapshot id found")
            skipped.append({"user": user_name, "reason": "no latest DQD snapshot id found"})
            continue
        
        intervention_id = write_intervention(
            user_id=user_id,
            snapshot_id=snapshot_id,
            guidance_text=message["guidance_text"],
            explanation_text=message["explanation_text"]
        )
        
        delivered.append({
            "user": user_name,
            "dqd_index": latest["dqdIndex"],
            "trajectory": latest["trajectoryType"],
            "intervention_id": intervention_id,
            "top_feature": message["top_features"][0]["display_name"] if message["top_features"] else "unknown"
        })
        
        print(
            f"  Delivered to {user_name}: "
            f"DQD={latest['dqdIndex']:.2f} | "
            f"trigger={message['top_features'][0]['display_name'] if message['top_features'] else 'general'}"
        )
    
    return {
        "delivered": len(delivered),
        "skipped": len(skipped),
        "details": delivered
    }

def get_pending_intervention(user_id: str):
    from sqlalchemy import text
    from database import engine
    import pandas as pd

    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT 
                id,
                "guidanceText",
                "explanationText",
                "triggeredAt"
            FROM "Intervention"
            WHERE "userId" = :user_id
            AND "accepted" IS NULL
            AND "dismissed" = false
            ORDER BY "triggeredAt" DESC
            LIMIT 1
        """), {"user_id": user_id})
        rows = result.fetchall()

    if not rows:
        return None

    row = rows[0]
    return {
        "id": str(row[0]),
        "guidance_text": str(row[1]),
        "explanation_text": str(row[2]),
        "triggered_at": str(row[3])
    }

def acknowledge_intervention(intervention_id: str, accepted: bool, rating=None):
    from sqlalchemy import text
    from database import engine

    with engine.connect() as conn:
        conn.execute(text("""
            UPDATE "Intervention"
            SET 
                "accepted" = :accepted,
                "dismissed" = :dismissed,
                "explanationRating" = :rating
            WHERE id = :intervention_id
        """), {
            "intervention_id": intervention_id,
            "accepted": accepted,
            "dismissed": not accepted,
            "rating": rating
        })
        conn.commit()