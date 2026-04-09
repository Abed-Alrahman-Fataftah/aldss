import json
from database import query_df, execute
from explainer import generate_guidance_message
from typing import Optional

# DQD threshold that triggers an intervention
DQD_THRESHOLD = 0.60
CONSECUTIVE_WEEKS_REQUIRED = 2

def get_latest_snapshots(user_id: str, limit: int = 3) -> list:
    df = query_df("""
        SELECT 
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
    """, {"user_id": user_id, "limit": limit})
    return df.to_dict("records") if len(df) > 0 else []

def intervention_already_sent_this_week(user_id: str, week_number: int) -> bool:
    df = query_df("""
        SELECT id FROM "Intervention"
        WHERE "userId" = :user_id
        AND EXTRACT(week FROM "triggeredAt") = EXTRACT(week FROM NOW())
    """, {"user_id": user_id})
    return len(df) > 0

def should_trigger_intervention(snapshots: list) -> bool:
    """
    Trigger intervention if DQD >= threshold for 
    CONSECUTIVE_WEEKS_REQUIRED weeks in a row.
    """
    if len(snapshots) < CONSECUTIVE_WEEKS_REQUIRED:
        # Not enough history — trigger if single snapshot is very high
        if len(snapshots) == 1 and snapshots[0]["dqdIndex"] >= 0.75:
            return True
        return False
    
    recent = snapshots[:CONSECUTIVE_WEEKS_REQUIRED]
    return all(s["dqdIndex"] >= DQD_THRESHOLD for s in recent)

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
    df = query_df("""
        INSERT INTO "Intervention"
        (id, "userId", "dqdSnapshotId", "guidanceText", "explanationText", "triggeredAt")
        VALUES (gen_random_uuid(), :user_id, :snapshot_id, :guidance_text, :explanation_text, NOW())
        RETURNING id
    """, {
        "user_id": user_id,
        "snapshot_id": snapshot_id,
        "guidance_text": guidance_text,
        "explanation_text": explanation_text
    })
    return df.iloc[0]["id"]

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
            skipped.append({"user": user_name, "reason": "no snapshots yet"})
            continue
        
        if intervention_already_sent_this_week(user_id, snapshots[0].get("weekNumber", 1)):
            skipped.append({"user": user_name, "reason": "already received intervention this week"})
            continue
        
        if not should_trigger_intervention(snapshots):
            skipped.append({
                "user": user_name,
                "reason": f"DQD {snapshots[0]['dqdIndex']:.2f} below threshold"
            })
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
        
        print(f"  Delivered to {user_name}: DQD={latest['dqdIndex']:.2f} | trigger={message['top_features'][0]['display_name'] if message['top_features'] else 'general'}")
    
    return {
        "delivered": len(delivered),
        "skipped": len(skipped),
        "details": delivered
    }

def get_pending_intervention(user_id: str) -> Optional[dict]:
    """
    Get the most recent unacknowledged intervention for a user.
    Called by the frontend to check if a guidance card should be shown.
    """
    df = query_df("""
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
    """, {"user_id": user_id})
    
    if len(df) == 0:
        return None
    
    row = df.iloc[0]
    return {
        "id": row["id"],
        "guidance_text": row["guidanceText"],
        "explanation_text": row["explanationText"],
        "triggered_at": str(row["triggeredAt"])
    }

def acknowledge_intervention(intervention_id: str, accepted: bool, rating: Optional[int] = None):
    """Record whether participant accepted or dismissed the intervention."""
    execute("""
        UPDATE "Intervention"
        SET 
            "accepted" = :accepted,
            "dismissed" = :dismissed,
            "explanationRating" = :rating
        WHERE id = :intervention_id
    """, {
        "intervention_id": intervention_id,
        "accepted": accepted,
        "dismissed": not accepted,
        "rating": rating
    })