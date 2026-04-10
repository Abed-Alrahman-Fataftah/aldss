import { useState } from "react";
import axios from "axios";
import { API_BASE } from '../services/api'

interface InterventionCardProps {
  intervention: {
    id: string;
    guidance_text: string;
    explanation_text: string;
  };
  onDismiss: () => void;
  onAccept: () => void;
}

export default function InterventionCard({
  intervention,
  onDismiss,
  onAccept,
}: InterventionCardProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const handleAccept = async () => {
    setShowRating(true);
  };

  const handleSubmitRating = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("aldss_token");
      await axios.post(
        `${API_BASE}/api/ai/acknowledge/${intervention.id}`,
        { accepted: true, rating },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onAccept();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismiss = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("aldss_token");
      await axios.post(
        `${API_BASE}/api/ai/acknowledge/${intervention.id}`,
        { accepted: false },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onDismiss();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const guidanceParagraphs = intervention.guidance_text
    .split("\n\n")
    .filter(Boolean);

  return (
    <div
      style={{
        border: "1.5px solid #AFA9EC",
        borderRadius: "12px",
        padding: "1.5rem",
        background: "white",
        marginBottom: "1.5rem",
        boxShadow: "0 2px 12px rgba(31,56,100,0.08)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#EEEDFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            flexShrink: 0,
          }}
        >
          💡
        </div>
        <div>
          <div
            style={{ fontWeight: 600, color: "#1F3864", fontSize: "0.95rem" }}
          >
            A pattern we noticed
          </div>
          <div style={{ fontSize: "0.8rem", color: "#888" }}>
            Based on your recent activity
          </div>
        </div>
      </div>

      {/* Guidance text */}
      <div style={{ marginBottom: "1rem" }}>
        {guidanceParagraphs.map((para, i) => (
          <p
            key={i}
            style={{
              fontSize: "0.9rem",
              color: "#333",
              lineHeight: 1.7,
              marginBottom: i < guidanceParagraphs.length - 1 ? "0.75rem" : 0,
            }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Explanation box */}
      <div
        style={{
          background: "#f8f9ff",
          border: "1px solid #e8e8f0",
          borderRadius: "8px",
          padding: "0.875rem 1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 600,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "5px",
          }}
        >
          Why we are showing you this
        </div>
        <div style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.6 }}>
          {intervention.explanation_text}
        </div>
      </div>

      {/* Rating view */}
      {showRating ? (
        <div>
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#333",
              marginBottom: "0.5rem",
            }}
          >
            How clear and useful was this guidance?
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#888",
              marginBottom: "0.75rem",
            }}
          >
            1 = not useful at all · 5 = very clear and useful
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                style={{
                  flex: 1,
                  padding: "0.6rem",
                  border: `1.5px solid ${rating === n ? "#1F3864" : "#ddd"}`,
                  borderRadius: "8px",
                  background: rating === n ? "#EEF4FF" : "white",
                  color: rating === n ? "#1F3864" : "#444",
                  fontWeight: rating === n ? 600 : 400,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmitRating}
            disabled={!rating || submitting}
            style={{
              width: "100%",
              padding: "0.7rem",
              background: !rating ? "#ddd" : "#1F3864",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: !rating ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            {submitting ? "Saving..." : "Submit rating"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={handleAccept}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "0.7rem",
              background: "#1F3864",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            This is helpful
          </button>
          <button
            onClick={handleDismiss}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "0.7rem",
              background: "white",
              color: "#888",
              border: "1.5px solid #ddd",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
