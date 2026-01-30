import React from 'react';

export default function TrendingTopics({ topicCounts, trendingTopics }) {
  return (
    <div style={{ 
        marginTop: "30px", 
        paddingTop: "20px", 
        borderTop: "1px solid #eee" 
      }}>
        <h4 style={{ marginBottom: "10px", fontSize: "16px" }}>
          Trending Topics
        </h4>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
          Most active opportunities
        </p>
        {trendingTopics.map(([topic, count], index) => (
          <div 
            key={topic}
            style={{
              padding: "8px",
              marginBottom: "8px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          >
            <span style={{ 
              fontWeight: "bold", 
              color: "#007bff",
              marginRight: "8px"
            }}>
              #{index + 1}
            </span>
            <span>{topic}</span>
          </div>
        ))}
      </div>
    );
}