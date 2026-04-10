import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { surveyAPI } from "../../services/api";
import axios from "axios";
import { API_BASE } from '../../services/api'


interface SessionSummary {
  totalSessions: number;
  totalMinutes: number;
  avgSessionMinutes: number;
  longestStreak: number;
  currentStreak: number;
  lastSevenDays: number;
}

interface SurveyTrend {
  weekNumber: number;
  motivationScore: number;
  perceivedProgress: number;
  submittedAt: string;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionSummary | null>(null);
  const [surveys, setSurveys] = useState<SurveyTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("aldss_token");

    Promise.all([
      axios.get(`${API_BASE}/api/sessions/my-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      surveyAPI.getMySurveys(),
    ])
      .then(([sessionRes, surveyRes]) => {
        setSessions(sessionRes.data);
        const weekly = surveyRes.data
          .filter((s: any) => s.surveyType === "WEEKLY")
          .sort((a: any, b: any) => a.weekNumber - b.weekNumber);
        setSurveys(weekly);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const consistencyColor = (score: number) => {
    if (score >= 7) return "#27ae60";
    if (score >= 4) return "#e67e22";
    return "#e74c3c";
  };

  const avgMotivation = surveys.length
    ? Math.round(
        (surveys.reduce((s, r) => s + (r.motivationScore || 0), 0) /
          surveys.length) *
          10,
      ) / 10
    : null;

  const avgProgress = surveys.length
    ? Math.round(
        (surveys.reduce((s, r) => s + (r.perceivedProgress || 0), 0) /
          surveys.length) *
          10,
      ) / 10
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Header */}
      <div
        style={{
          background: "#1F3864",
          color: "white",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            color: "white",
            padding: "0.4rem 0.875rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          ← Dashboard
        </button>
        <div style={{ fontWeight: 600 }}>My Progress</div>
      </div>

      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "2rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
            Loading your progress...
          </div>
        ) : (
          <>
            {/* Session stats */}
            {sessions && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h2
                  style={{
                    color: "#1F3864",
                    marginBottom: "1rem",
                    fontSize: "1.1rem",
                  }}
                >
                  Session activity
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                  }}
                >
                  {[
                    { label: "Total sessions", value: sessions.totalSessions },
                    { label: "Total minutes", value: sessions.totalMinutes },
                    {
                      label: "Sessions this week",
                      value: sessions.lastSevenDays,
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        background: "white",
                        borderRadius: "10px",
                        padding: "1.25rem",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "2rem",
                          fontWeight: 700,
                          color: "#1F3864",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {s.value}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#888" }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly survey trends */}
            {surveys.length > 0 ? (
              <div
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <h2
                  style={{
                    color: "#1F3864",
                    marginBottom: "0.25rem",
                    fontSize: "1.1rem",
                  }}
                >
                  Weekly check-in trends
                </h2>
                <p
                  style={{
                    color: "#888",
                    fontSize: "0.875rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  Average motivation: {avgMotivation}/10 · Average progress:{" "}
                  {avgProgress}/10
                </p>

                {surveys.map((survey) => (
                  <div key={survey.weekNumber} style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#333",
                        }}
                      >
                        Week {survey.weekNumber}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#888" }}>
                        Motivation {survey.motivationScore}/10 · Progress{" "}
                        {survey.perceivedProgress}/10
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            height: "6px",
                            background: "#eee",
                            borderRadius: "3px",
                          }}
                        >
                          <div
                            style={{
                              height: "6px",
                              borderRadius: "3px",
                              background: consistencyColor(
                                survey.motivationScore,
                              ),
                              width: `${survey.motivationScore * 10}%`,
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#aaa",
                            marginTop: "2px",
                          }}
                        >
                          Motivation
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            height: "6px",
                            background: "#eee",
                            borderRadius: "3px",
                          }}
                        >
                          <div
                            style={{
                              height: "6px",
                              borderRadius: "3px",
                              background: consistencyColor(
                                survey.perceivedProgress,
                              ),
                              width: `${survey.perceivedProgress * 10}%`,
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#aaa",
                            marginTop: "2px",
                          }}
                        >
                          Progress
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#888" }}>
                  No weekly check-ins yet. Complete your first one to see your
                  trends here.
                </p>
                <button
                  className="btn btn-primary mt-2"
                  style={{ width: "auto", padding: "0.6rem 1.5rem" }}
                  onClick={() => navigate("/weekly-survey")}
                >
                  Complete week 1 check-in
                </button>
              </div>
            )}

            {/* Encouragement message */}
            <div
              style={{
                background: "linear-gradient(135deg, #1F3864, #2E75B6)",
                borderRadius: "12px",
                padding: "1.5rem 2rem",
                color: "white",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                Keep going, {user?.fullName?.split(" ")[0]}
              </div>
              <div
                style={{ fontSize: "0.9rem", opacity: 0.9, lineHeight: 1.6 }}
              >
                Consistency over intensity. Showing up regularly — even for
                short sessions — is what separates learners who finish from
                those who do not. You are part of a research study that is
                helping us understand exactly this.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
