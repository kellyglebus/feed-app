import React, { useState } from "react";

export default function Onboarding({ topics, onComplete }) {
  const [selectedTopics, setSelectedTopics] = useState([]);

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleContinue = () => {
    if (selectedTopics.length >= 2) {
      onComplete(selectedTopics);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      backgroundColor: "#f5f5f5"
    }}>
      <div style={{
        maxWidth: "600px",
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ marginBottom: "10px" }}>Welcome to GovFeed</h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Select at least 2 topics that interest you to personalize your feed
        </p>

        <div style={{ marginBottom: "30px" }}>
          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              style={{
                display: "block",
                width: "100%",
                padding: "15px",
                margin: "10px 0",
                border: selectedTopics.includes(topic) ? "2px solid #007bff" : "2px solid #ddd",
                backgroundColor: selectedTopics.includes(topic) ? "#e7f3ff" : "white",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                textAlign: "left",
                transition: "all 0.2s"
              }}
            >
              <span style={{ marginRight: "10px" }}>
                {selectedTopics.includes(topic) ? "✓" : "○"}
              </span>
              {topic}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedTopics.length < 2}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: selectedTopics.length >= 2 ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: selectedTopics.length >= 2 ? "pointer" : "not-allowed",
            fontWeight: "bold"
          }}
        >
          Continue ({selectedTopics.length}/2 minimum)
        </button>
      </div>
    </div>
  );
}