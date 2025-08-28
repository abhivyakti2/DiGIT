import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function RepoCard({ repo, hideOwner }) {
  const navigate = useNavigate()

  return (
    <div
      className="card"
      style={{
        margin: 0,
        padding: "var(--space-6)",
        position: 'relative',
        cursor: 'pointer',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Repo name + owner */}
      <div>
        {/* Repo name */}
        <h4 style={{ 
          margin: "0 0 var(--space-3) 0",
          fontSize: "1.1rem",
          fontWeight: "600"
        }}>
          <Link
            to={`/repo/${repo.owner}/${repo.name}`}
            style={{
              fontWeight: "600",
              fontFamily: "inherit",
              textDecoration: "none",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span style={{ color: "var(--primary)" }}>📦</span>
            {repo.name}
          </Link>
        </h4>

        {/* Owner avatar + name */}
        {!hideOwner && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "var(--space-3)",
              maxWidth: "200px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }}
                          onClick={() => navigate(`/profile/${repo.owner}`)}

            title={repo.owner}
          >
            <img
              src={`https://github.com/${repo.owner}.png`}
              alt={repo.owner}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                marginRight: "var(--space-2)",
                flexShrink: 0,
                border: "1px solid var(--border)"
              }}

            />
            <span
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
              }}
            >
              {repo.owner}
            </span>
          </div>
        )}

        {/* Description - 2 lines max */}
        {repo.description && (
          <p
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: "0 0 var(--space-4) 0",
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
              lineHeight: "1.5"
            }}
          >
            {repo.description}
          </p>
        )}

        {/* Topics - max 3 */}
        {repo.topics && repo.topics.length > 0 && (
          <div style={{ margin: "0 0 var(--space-4) 0" }}>
            {repo.topics.slice(0, 3).map((topic, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  borderRadius: 'var(--radius)',
                  padding: 'var(--space-1) var(--space-3)',
                  marginRight: "var(--space-2)",
                  marginBottom: "var(--space-1)",
                  fontSize: '0.75rem',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--primary)',
                  border: '1px solid var(--primary)',
                  fontWeight: '500'
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats - moved to bottom */}
      <div className="repo-stats" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 'var(--space-3)',
        borderTop: '1px solid var(--border)',
        fontSize: '0.875rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            ⭐ {repo.stars}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            🍴 {repo.forks}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            🐛 {repo.open_issues}
          </span>
        </div>
        {repo.language && (
          <span style={{
            background: 'var(--bg-tertiary)',
            padding: 'var(--space-1) var(--space-2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>
            {repo.language}
          </span>
        )}
      </div>
    </div>
  )
}
