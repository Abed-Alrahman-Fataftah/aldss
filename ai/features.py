import pandas as pd
import numpy as np
from database import query_df
from datetime import datetime, timedelta

def get_user_sessions(user_id: str, weeks_back: int = 4) -> pd.DataFrame:
    since = datetime.now() - timedelta(weeks=weeks_back)
    return query_df("""
        SELECT 
            id,
            "userId",
            "startedAt",
            "endedAt",
            "durationSeconds",
            "idleSeconds",
            "daysSinceLast"
        FROM "Session"
        WHERE "userId" = :user_id
        AND "startedAt" >= :since
        ORDER BY "startedAt" ASC
    """, {"user_id": user_id, "since": since})

def get_user_events(user_id: str, weeks_back: int = 4) -> pd.DataFrame:
    since = datetime.now() - timedelta(weeks=weeks_back)
    return query_df("""
        SELECT 
            id,
            "userId",
            "eventType",
            "depthScore",
            "timestamp",
            "trackId",
            "contentId"
        FROM "BehavioralEvent"
        WHERE "userId" = :user_id
        AND "timestamp" >= :since
        ORDER BY "timestamp" ASC
    """, {"user_id": user_id, "since": since})

def get_user_surveys(user_id: str) -> pd.DataFrame:
    return query_df("""
        SELECT 
            "weekNumber",
            "motivationScore",
            "perceivedProgress",
            "studyHours",
            "submittedAt"
        FROM "SurveyResponse"
        WHERE "userId" = :user_id
        AND "surveyType" = 'WEEKLY'
        ORDER BY "weekNumber" ASC
    """, {"user_id": user_id})

def compute_f1_session_regularity(sessions: pd.DataFrame) -> float:
    """F1: Standard deviation of inter-session gaps — higher = more irregular = higher DQD"""
    if len(sessions) < 2:
        return 0.5  # neutral score when insufficient data
    
    gaps = sessions["daysSinceLast"].dropna().values
    if len(gaps) == 0:
        return 0.5
    
    std = float(np.std(gaps))
    # Normalize: 0 gaps std = perfect consistency (0.0), 7+ days std = high DQD (1.0)
    normalized = min(std / 7.0, 1.0)
    return round(normalized, 4)

def compute_f2_content_depth(events: pd.DataFrame) -> float:
    """F2: Ratio of deep interactions to total content interactions"""
    content_events = events[events["eventType"] == "CONTENT_VIEW"]
    
    if len(content_events) == 0:
        return 0.5
    
    deep = content_events[
        content_events["depthScore"].notna() & 
        (content_events["depthScore"] >= 0.7)
    ]
    
    ratio = len(deep) / len(content_events)
    # Invert: low depth ratio = high DQD
    return round(1.0 - ratio, 4)

def compute_f3_path_switch_rate(events: pd.DataFrame, sessions: pd.DataFrame) -> float:
    """F3: Path switches per week normalized"""
    path_switches = events[events["eventType"] == "PATH_SWITCH"]
    
    if len(sessions) == 0:
        return 0.5
    
    weeks = max(1, len(sessions) / 3)  # estimate weeks from sessions
    switches_per_week = len(path_switches) / weeks
    
    # Normalize: 0 switches = 0.0, 3+ per week = 1.0
    normalized = min(switches_per_week / 3.0, 1.0)
    return round(normalized, 4)

def compute_f4_quiz_recovery(events: pd.DataFrame) -> float:
    """F4: Ratio of quiz retries after failure — low recovery = high DQD"""
    quiz_attempts = events[events["eventType"] == "QUIZ_ATTEMPT"]
    
    if len(quiz_attempts) == 0:
        return 0.5
    
    # Low depth score on quiz = poor performance
    poor_attempts = quiz_attempts[
        quiz_attempts["depthScore"].notna() &
        (quiz_attempts["depthScore"] < 0.6)
    ]
    
    if len(poor_attempts) == 0:
        return 0.0  # no failures = good
    
    # Check if retries happened after poor attempts
    # For now use ratio of poor attempts as proxy
    failure_rate = len(poor_attempts) / len(quiz_attempts)
    return round(failure_rate, 4)

def compute_f5_return_velocity(sessions: pd.DataFrame) -> float:
    """F5: Trend in days between sessions — increasing gaps = higher DQD"""
    gaps = sessions["daysSinceLast"].dropna().values
    
    if len(gaps) < 3:
        return 0.3  # insufficient data — assume moderate
    
    # Linear trend: positive slope = gaps increasing = higher DQD
    x = np.arange(len(gaps))
    slope = np.polyfit(x, gaps, 1)[0]
    
    # Normalize: slope of 0 = 0.5, slope of +2 days/week = 1.0, negative = 0.0
    normalized = max(0.0, min(1.0, 0.5 + slope / 4.0))
    return round(normalized, 4)

def compute_f6_idle_ratio(sessions: pd.DataFrame) -> float:
    """F6: Total idle time divided by total session time"""
    sessions_with_duration = sessions[
        sessions["durationSeconds"].notna() & 
        (sessions["durationSeconds"] > 0)
    ]
    
    if len(sessions_with_duration) == 0:
        return 0.3
    
    total_duration = sessions_with_duration["durationSeconds"].sum()
    total_idle = sessions_with_duration["idleSeconds"].sum()
    
    if total_duration == 0:
        return 0.3
    
    ratio = total_idle / total_duration
    return round(min(ratio, 1.0), 4)

def compute_f7_goal_modification(events: pd.DataFrame, sessions: pd.DataFrame) -> float:
    """F7: Goal edit frequency per week"""
    goal_edits = events[events["eventType"] == "GOAL_EDIT"]
    weeks = max(1, len(sessions) / 3)
    edits_per_week = len(goal_edits) / weeks
    
    # Normalize: 0 edits = 0.0, 2+ per week = 1.0
    normalized = min(edits_per_week / 2.0, 1.0)
    return round(normalized, 4)

def compute_f8_perceived_actual_gap(
    surveys: pd.DataFrame,
    week_number: int,
    quiz_score_avg: float
) -> float:
    """F8: Gap between self-reported progress and actual quiz performance"""
    week_survey = surveys[surveys["weekNumber"] == week_number]
    
    if len(week_survey) == 0:
        return 0.3
    
    perceived = week_survey.iloc[0]["perceivedProgress"]
    if perceived is None:
        return 0.3
    
    # Normalize perceived to 0-1
    perceived_normalized = float(perceived) / 10.0
    
    # Gap between perception and reality
    gap = abs(perceived_normalized - quiz_score_avg)
    return round(min(gap, 1.0), 4)

def compute_dqd_index(
    user_id: str,
    week_number: int,
    weeks_back: int = 4
) -> dict:
    """
    Compute the full DQD index for a user for a given week.
    Returns all 8 features and the composite DQD score.
    """
    # Load all data
    sessions = get_user_sessions(user_id, weeks_back)
    events = get_user_events(user_id, weeks_back)
    surveys = get_user_surveys(user_id)
    
    # Compute average quiz score for F8
    quiz_events = events[events["eventType"] == "QUIZ_ATTEMPT"]
    avg_quiz_score = float(quiz_events["depthScore"].mean()) if len(quiz_events) > 0 else 0.5
    
    # Compute all 8 features
    f1 = compute_f1_session_regularity(sessions)
    f2 = compute_f2_content_depth(events)
    f3 = compute_f3_path_switch_rate(events, sessions)
    f4 = compute_f4_quiz_recovery(events)
    f5 = compute_f5_return_velocity(sessions)
    f6 = compute_f6_idle_ratio(sessions)
    f7 = compute_f7_goal_modification(events, sessions)
    f8 = compute_f8_perceived_actual_gap(surveys, week_number, avg_quiz_score)
    
    # Weights from thesis design
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
    
    features = {
        "f1_session_regularity": f1,
        "f2_content_depth": f2,
        "f3_path_switch_rate": f3,
        "f4_quiz_recovery": f4,
        "f5_return_velocity": f5,
        "f6_idle_ratio": f6,
        "f7_goal_modification": f7,
        "f8_perceived_actual_gap": f8
    }
    
    # Compute weighted DQD index
    dqd_index = sum(
        features[key] * weights[key]
        for key in features
    )
    
    return {
        "user_id": user_id,
        "week_number": week_number,
        "dqd_index": round(dqd_index, 4),
        "features": features,
        "weights": weights,
        "data_points": {
            "sessions": len(sessions),
            "events": len(events),
            "surveys": len(surveys)
        }
    }