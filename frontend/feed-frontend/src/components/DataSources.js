import React from 'react';

export default function DataSources({ }) {
  return (
    <div style={{ 
        marginTop: "30px", 
        paddingTop: "20px", 
        borderTop: "1px solid #eee" 
      }}>
        <h4 style={{ marginBottom: "10px", fontSize: "16px" }}>
          Data Sources
        </h4>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
          Aggregating opportunities from trusted government platforms
        </p>
        
        <div style={{ fontSize: "13px" }}>
          {/* Active Sources */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "6px" 
            }}>
              <span style={{ 
                width: "8px", 
                height: "8px", 
                borderRadius: "50%", 
                backgroundColor: "#28a745", 
                marginRight: "8px" 
              }}></span>
              <a 
                href="https://grants.gov" 
                target="_blank" 
                rel="noreferrer"
                style={{ color: "#007bff", textDecoration: "none" }}
              >
                Grants.gov
              </a>
            </div>
            <p style={{ fontSize: "11px", color: "#999", marginLeft: "16px", marginBottom: "8px" }}>
              Federal grant opportunities
            </p>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "6px" 
            }}>
              <span style={{ 
                width: "8px", 
                height: "8px", 
                borderRadius: "50%", 
                backgroundColor: "#28a745", 
                marginRight: "8px" 
              }}></span>
              <a 
                href="https://sam.gov" 
                target="_blank" 
                rel="noreferrer"
                style={{ color: "#007bff", textDecoration: "none" }}
              >
                SAM.gov
              </a>
            </div>
            <p style={{ fontSize: "11px", color: "#999", marginLeft: "16px", marginBottom: "8px" }}>
              Government contracts & awards
            </p>
          </div>
        </div>
      </div>
    );
}