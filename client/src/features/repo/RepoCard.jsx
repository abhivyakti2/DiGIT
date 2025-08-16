import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function RepoCard({ repo }) {
  const navigate = useNavigate()

  return (
    <div
      className="card"
      onClick={() => navigate(`/repo/${repo.owner}/${repo.name}`)}
      style={{
        margin: 12,
        padding: 15,
        border: '0.5px solid #ccc',
        borderRadius: 10,
        position: 'relative'
      }}
    >
      {/* Repo name + owner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Repo name */}
        <h4 style={{ margin: "6px 0 8px 0" }}>
          <Link
            to={`/repo/${repo.owner}/${repo.name}`}
            style={{
              fontWeight: "bold",
              fontFamily: "inherit",
              textDecoration: "none",
              color: "inherit"
            }}
          >
            {repo.name}
          </Link>
        </h4>
      </div>

      {/* Owner avatar + name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "6px",   // more space
          maxWidth: "200px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis"
        }}
        title={repo.owner}
      >
        <img
          src={`https://github.com/${repo.owner}.png`}
          alt={repo.owner}
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            marginRight: 6,
            flexShrink: 0
          }}
        />
        <span
          style={{
            fontSize: "0.9em",
            opacity: 0.85,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
          }}
        >
          {repo.owner}
        </span>
      </div>

      {/* Description - 2 lines max */}
      {repo.description && (
        <p
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: '6px 0'
          }}
        >
          {repo.description}
        </p>
      )}

      {/* Topics - max 5 */}
      {repo.topics && repo.topics.length > 0 && (
  <div style={{ margin: '6px 0' }}>
    {repo.topics.slice(0, 3).map((topic, idx) => (
      <span
        key={idx}
        style={{
          display: 'inline-block',
          borderRadius: '12px',        // more rounded edges
          padding: '2px 8px',
          marginRight: 6,
          marginBottom: 4,
          fontSize: '0.8em',
          border: '1px solid #646cff',    // outline
        }}
      >
        {topic}
      </span>
    ))}
  </div>
)}


      {/* Stats */}
      <p style={{ margin: '6px 0' }}>
        ⭐ {repo.stars} | 🍴 {repo.forks} | {repo.language || 'No language'}
      </p>
    </div>
  )
}
