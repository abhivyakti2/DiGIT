import React from 'react'
import { Link } from 'react-router-dom'

export default function RepoCard({ repo }) {
  return (
    <div style={{ margin: 12, padding: 12, border: '1px solid #ccc', borderRadius: 4 }}>
      <h4>
        <Link to={`/repo/${repo.owner}/${repo.name}`}>
          {repo.name}
        </Link>
      </h4>
      <p>Owner: {repo.owner}</p>
      <p>⭐ {repo.stars} | Last commit: {repo.last_commit || '–'}</p>
      {repo.description && <p>{repo.description.slice(0, 120)}…</p>}
      {repo.url && (
        <p><a href={repo.url} target="_blank" rel="noreferrer">Project Link</a></p>
      )}
      <button onClick={() => navigator.clipboard.writeText(window.location.href)}>Embed</button>
    </div>
  )
}
