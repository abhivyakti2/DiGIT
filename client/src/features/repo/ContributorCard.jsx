import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { useUserDetails } from "../../api/github";
import UserProfileCard from "../user/UserProfileCard";
import Loading from "../../componenets/Loading";
export default function ContributorCard({ contributor }) {
  const [showPreview, setShowPreview] = useState(false);
  const { data: profileData, isLoading } = useUserDetails(showPreview ? contributor.username : undefined);

  const [pos, setPos] = useState({});
  const cardRef = useRef();

  return (
    <div
      ref={cardRef}
      style={{
        position: "relative",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "var(--space-4)",
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius-lg)",
        minWidth: 120,
        minHeight: 150,
        boxShadow: "var(--shadow)",
        transition: "box-shadow 0.2s",
        zIndex: 1,
      }}
      onMouseEnter={() => {
  setShowPreview(true);
  if (cardRef.current) {
    const rect = cardRef.current.getBoundingClientRect();
    const cardWidth = 320; // width of preview
    const offsetY = 8; // space between card and preview

    let left = rect.left-90; // align left edge
    let top = rect.bottom + offsetY; // place below the card

    // ✅ If it goes off the right edge, shift left
    if (left + cardWidth > window.innerWidth) {
      left = window.innerWidth - cardWidth - 8; // 8px margin
    }

    // ✅ If it goes off the bottom, show above instead
    if (top + 200 > window.innerHeight) { // assume preview ~200px tall
      top = rect.top - 200 - offsetY; // place above
    }

    setPos({ left, top });
  }
}}

      onMouseLeave={() => setShowPreview(false)}
    >
      <Link to={`/profile/${contributor.username}`}>
        <img
          src={contributor.avatar}
          alt={contributor.username}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "var(--space-2)",
            border: "2px solid var(--primary)",
          }}
        />
      </Link>
      <div
        style={{
          fontWeight: "bold",
          color: "var(--text-primary)",
          fontSize: "1rem",
          marginBottom: "var(--space-2)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: 120,
          textAlign: "center",
        }}
        title={contributor.username}
      >
        {contributor.username}
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
        {contributor.contributions} contributions
      </div>

      {/* Floating preview card in Portal */}
      {showPreview &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              left: pos.left,
              top: pos.top,
              zIndex: 9999,
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-lg)",
              width: 320,
              boxShadow: "var(--shadow-lg)",
              pointerEvents: "none",
            }}
          >
             {isLoading ? <Loading /> : profileData ? <UserProfileCard user={profileData} /> : null}
          </div>,
          document.body
        )
      }
    </div>
  );
}
