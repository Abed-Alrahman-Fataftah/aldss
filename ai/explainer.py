import shap
import numpy as np
import pandas as pd
from typing import Dict

# Feature display names for human-readable explanations
FEATURE_NAMES = {
    "f1_session_regularity": "session consistency",
    "f2_content_depth": "content engagement depth",
    "f3_path_switch_rate": "learning path stability",
    "f4_quiz_recovery": "quiz recovery pattern",
    "f5_return_velocity": "return frequency trend",
    "f6_idle_ratio": "active focus time",
    "f7_goal_modification": "goal commitment",
    "f8_perceived_actual_gap": "self-awareness accuracy"
}

FEATURE_GUIDANCE = {
    "f1_session_regularity": {
        "high": "Your session timing has become irregular. Learners who study at consistent times retain more and drop out less. Try scheduling your next three sessions right now.",
        "low": "Your session timing is consistent — keep this up. Consistency is the strongest predictor of long-term learning success."
    },
    "f2_content_depth": {
        "high": "Your recent sessions show shallow engagement — quick scrolls and fast clicks. Try slowing down on one module today and reading it fully before moving to the quiz.",
        "low": "You are engaging deeply with the content. This kind of thorough engagement builds real understanding."
    },
    "f3_path_switch_rate": {
        "high": "You have switched learning tracks several times recently. Each switch resets your momentum. Try committing to one track for the next two weeks before deciding to change.",
        "low": "You are staying focused on your chosen learning path. This kind of commitment is what produces real skill development."
    },
    "f4_quiz_recovery": {
        "high": "When quizzes go poorly, you tend to move on quickly rather than retrying. The struggle of retrying is actually where learning happens — try going back to one failed quiz today.",
        "low": "You recover well after quiz failures by retrying and engaging more. This resilience is a strong learning habit."
    },
    "f5_return_velocity": {
        "high": "The gaps between your learning sessions are growing longer. This pattern often leads to dropout. Scheduling even a short 15-minute session today can break this trend.",
        "low": "You are returning to the platform regularly. Consistent return frequency is one of the best predictors of completion."
    },
    "f6_idle_ratio": {
        "high": "A large portion of your session time is idle — the platform is open but you are not engaging. Shorter, focused sessions are more effective than long unfocused ones.",
        "low": "Your active engagement during sessions is high. Quality focus time is more valuable than total time spent."
    },
    "f7_goal_modification": {
        "high": "You have been changing your learning goals frequently. While adaptation is healthy, too much goal-switching signals uncertainty. Try writing down why your current goal matters to you.",
        "low": "Your goals have been stable. Clear, committed goals are strongly linked to completion and real skill development."
    },
    "f8_perceived_actual_gap": {
        "high": "There is a gap between how you feel you are progressing and what your quiz results show. This is worth paying attention to — it helps to review recent module content before moving forward.",
        "low": "Your self-assessment aligns well with your actual performance. This kind of accurate self-awareness helps you study more efficiently."
    }
}

def get_top_contributing_features(features: Dict[str, float], weights: Dict[str, float], top_n: int = 3) -> list:
    """
    Identify the features contributing most to a high DQD score.
    Returns top N features sorted by weighted contribution.
    """
    contributions = []
    for feature_name, value in features.items():
        weight = weights.get(feature_name, 0)
        contribution = value * weight
        contributions.append({
            "feature": feature_name,
            "value": value,
            "weight": weight,
            "contribution": round(contribution, 4),
            "display_name": FEATURE_NAMES.get(feature_name, feature_name)
        })
    
    contributions.sort(key=lambda x: x["contribution"], reverse=True)
    return contributions[:top_n]

def generate_explanation_text(top_features: list) -> str:
    """
    Generate human-readable explanation from top contributing features.
    """
    if not top_features:
        return "Your learning patterns suggest it may be a good time to refocus."
    
    primary = top_features[0]
    feature_name = primary["feature"]
    value = primary["value"]
    
    # High value = this feature is contributing to DQD
    guidance_key = "high" if value > 0.5 else "low"
    primary_text = FEATURE_GUIDANCE.get(feature_name, {}).get(
        guidance_key,
        "We noticed a change in your learning patterns."
    )
    
    return primary_text

def generate_guidance_message(
    dqd_index: float,
    features: Dict[str, float],
    weights: Dict[str, float],
    trajectory: str,
    participant_name: str
) -> Dict[str, str]:
    """
    Generate a complete intervention message with explanation.
    Returns guidance_text and explanation_text.
    """
    first_name = participant_name.split()[0] if participant_name else "there"
    top_features = get_top_contributing_features(features, weights)
    
    # Build explanation text
    explanation_parts = []
    for feat in top_features[:3]:
        display = FEATURE_NAMES.get(feat["feature"], feat["feature"])
        if feat["value"] > 0.5:
            explanation_parts.append(f"your {display} has declined recently")
        
    if explanation_parts:
        explanation_text = "We are showing you this because " + ", and ".join(explanation_parts) + "."
    else:
        explanation_text = "We noticed some changes in your recent learning patterns."
    
    # Add behavioral specifics
    top_feature = top_features[0] if top_features else None
    if top_feature:
        feature_name = top_feature["feature"]
        guidance_text = FEATURE_GUIDANCE.get(feature_name, {}).get("high", "")
    else:
        guidance_text = "It might be a good time to refocus on your learning goals."
    
    # Personalize opening based on trajectory
    if trajectory == "DECLINING":
        opening = f"{first_name}, we have noticed your learning momentum has been declining over the past two weeks."
    elif dqd_index > 0.70:
        opening = f"{first_name}, your recent learning patterns suggest you may be at risk of losing momentum."
    else:
        opening = f"{first_name}, we noticed a pattern worth paying attention to in your recent learning activity."
    
    full_guidance = f"{opening}\n\n{guidance_text}"
    
    # Add actionable suggestions based on top features
    suggestions = generate_action_suggestions(top_features)
    
    return {
        "guidance_text": full_guidance,
        "explanation_text": explanation_text,
        "top_features": top_features,
        "suggestions": suggestions
    }

def generate_action_suggestions(top_features: list) -> list:
    """Generate 2-3 specific actionable suggestions."""
    suggestion_map = {
        "f1_session_regularity": "Schedule your next 3 study sessions right now — pick specific times and add them to your calendar.",
        "f2_content_depth": "Choose one module today and read it fully without rushing to the quiz.",
        "f3_path_switch_rate": "Commit to your current track for 7 more days before considering a switch.",
        "f4_quiz_recovery": "Go back to the last quiz you did not pass and try it again — even one retry matters.",
        "f5_return_velocity": "Log in for just 15 minutes today to break the gap pattern.",
        "f6_idle_ratio": "Try a shorter 20-minute focused session rather than a longer unfocused one.",
        "f7_goal_modification": "Write down in one sentence why your current learning goal matters to you personally.",
        "f8_perceived_actual_gap": "Review the last module you completed before moving to the next one."
    }
    
    suggestions = []
    for feat in top_features[:3]:
        if feat["value"] > 0.4:
            suggestion = suggestion_map.get(feat["feature"])
            if suggestion:
                suggestions.append(suggestion)
    
    return suggestions[:3]