// components/TopicButton.js
import React from 'react';

export default function TopicButton({ topic, isSelected, count, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        padding: "8px",  // ← Reduced from 10px
        margin: "5px 0",
        border: isSelected ? "2px solid #007bff" : "2px solid #ddd",
        backgroundColor: isSelected ? "#e7f3ff" : "white",
        borderRadius: "4px",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "14px"  // ← Reduced from 16px
      }}
    >
      <span style={{ marginRight: "8px" }}>
        {isSelected ? "✓" : "○"}
      </span>
      {topic}
      {count && (
        <span style={{ 
          float: "right", 
          fontSize: "12px", 
          color: "#999",
          backgroundColor: "#f0f0f0",
          padding: "2px 6px",
          borderRadius: "10px"
        }}>
          {count}
        </span>
      )}
    </button>
  );
}