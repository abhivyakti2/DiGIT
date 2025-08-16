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
        margin: 12,
        padding: 15,
        border: "0.5px solid #ccc",
        borderRadius: 10,
        position: "relative", // for absolute embed button
        minHeight: 200,
      }}
    >
      {/* User info */}
      <div
        style={{ display: "flex", alignItems: "flex-start", cursor: "pointer" }}
        onClick={() => navigate(`/profile/${user.username}`)}
      >
        <img
          src={user.avatar}
          alt={user.username}
          width={80}
          height={80}
          style={{ objectFit: "cover", borderRadius: "50%" }}
        />{" "}
        <div style={{ marginLeft: 16 }}>
          <h4
            style={{
              margin: "4px 0 5px 0",
              maxWidth: "150px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={user.username} // so full name shows on hover
          >
            {user.username}
          </h4>{" "}
          <small>
            Repos: {user.public_repos ?? "–"} | Followers:{" "}
            {user.followers ?? "–"}
          </small>
        </div>
      </div>
      <div>
        <div style={{ marginLeft: 16, marginTop: 10 }}>
          {user.bio && <p>{user.bio}</p>}
          {user.top_repos && user.top_repos.length > 0 && (
            <>
              <p>Top ⭐ Repos:</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {user.top_repos.slice(0, 3).map((r) => (
                  <li key={r.name}>
                    <Link to={`/repo/${user.username}/${r.name}`}>
                      {r.name}
                    </Link>{" "}
                    ({r.stars}★)
                  </li>
                ))}
              </ul>
            </>
          )}
          {/* <small>Last commit: {user.last_commit || "–"}</small> */}
        </div>
      </div>

      {/* Embed button row */}
      {/* <div style={{ marginTop: 12 }}>
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          Embed
        </button>
      </div> */}
    </div>
  );
}
