import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function UserProfileCard({ user }) {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column", // stack items vertically
        justifyContent: "space-between",
        margin: 0,
        padding: "var(--space-6)",
        position: "relative", // for absolute embed button
        minHeight: "240px",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/profile/${user.username}`)}
    >
      {/* User info */}
      <div
        style={{ display: "flex",  alignItems: "flex-start" }}
      >
        <img
          src={user.avatar}
          alt={user.username}
          style={{ 
            width: "64px",
            height: "64px",
            objectFit: "cover", 
            borderRadius: "50%",
            border: "3px solid var(--border)",
            boxShadow: "var(--shadow-md)"
          }}
        />
        <div style={{ marginLeft: "var(--space-4)",  flex: 1 }}>
          <h4
            style={{
              margin: "0 0 var(--space-2) 0",
              maxWidth: "180px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "var(--text-primary)",
              fontSize: "1.1rem",
              fontWeight: "600"
            }}
            title={user.username}
          >
            {user.username}
          </h4>
          <div className="user-stats" style={{
            display: "flex",
            gap: "var(--space-4)",
            fontSize: "0.875rem",
            color: "var(--text-muted)"
          }}>
            <span>📦 {user.public_repos ?? "–"}</span>
            <span>👥 {user.followers ?? "–"}</span>
            
          </div>
          
        </div>
        
      </div>
      {/* Top Languages */}
        {Array.isArray(user.repoLanguages) && user.repoLanguages.length > 0 && (
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
            <strong >Languages:</strong>{" "}
            {user.repoLanguages.slice(0, 3).join(", ")}
          </div>
        )}
      
        {/* Website */}
        {user.website && (
          <div style={{ fontSize: "0.85rem", marginBottom: "6px" }}>
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary)", fontWeight: "500", textDecoration: "none" }}
              onClick={(e) => e.stopPropagation()} // Prevent navigation override
            >
{user.website
  .replace(/^https?:\/\//, "") // Remove http:// or https://
  .replace(/^www\./, "")       // Remove www.
  .replace(/\/$/, "")}                 </a>
          </div>
        )}

      <div style={{ marginTop: "var(--space-4)" }}>
        <div>
          

        {/* Bio */}
          {user.bio && (
            <p style={{
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
              lineHeight: "1.5",
              marginBottom: "var(--space-3)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}>
              {user.bio}
            </p>
          )}
          
        </div>
      </div>
    </div>
  );
}
