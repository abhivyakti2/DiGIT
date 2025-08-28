import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { useUserDetails } from "../../api/github";
import UserProfileCard from "../user/UserProfileCard";
import Loading from "../../componenets/Loading";

function ContributorPreview({ username, avatar, author }) {
  const [showPreview, setShowPreview] = useState(false);
  const { data: profileData, isLoading } = useUserDetails(
    showPreview ? username : undefined
  );

  const [pos, setPos] = useState({});
  const ref = useRef();

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={() => {
  setShowPreview(true);
  if (ref.current) {
    const rect = ref.current.getBoundingClientRect();
    const offsetX = 12; // small horizontal gap
    const offsetY = 8;  // small vertical gap

    let left = rect.right + offsetX -100;
    let top = rect.top - offsetY - 100;

    

  

    setPos({ left, top });
  }
}}

      onMouseLeave={() => setShowPreview(false)}
    >
      {avatar && (
        <img
          src={avatar}
          alt={author}
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
          }}
        />
      )}
      <Link
        to={`/profile/${username}`}
        style={{
          color: "var(--primary)",
          textDecoration: "none",
        }}
        
      >
        {username || "Unknown"}
      </Link>

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
            {isLoading ? (
              <Loading />
            ) : profileData ? (
              <UserProfileCard user={profileData} />
            ) : null}
          </div>,
          document.body
        )}
    </div>
  );
}

export default ContributorPreview;
