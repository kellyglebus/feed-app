import React from 'react';

export default function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div style={{ marginBottom: "20px", marginTop: "15px" }}>
      <input
        type="text"
        placeholder="Search all opportunities by title..."
        value={searchQuery}
        onChange={onSearchChange}
        style={{
          width: "100%",
          padding: "12px 15px",
          fontSize: "14px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          boxSizing: "border-box"
        }}
      />
      {searchQuery && (
        <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
          Searching all topics for: "{searchQuery}"
        </p>
      )}
    </div>
  );
}