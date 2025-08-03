import React from 'react'
import { Link } from 'react-router-dom'

export default function UserProfileCard({ user }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', margin: 12, padding: 12, border: '1px solid #ccc', borderRadius: 4 }}>
      <img src={user.avatar} alt={user.username} width={80} />
      <div style={{ marginLeft: 16, flex: 1 }}>
        <h4>{user.username}</h4>
        {user.bio && <p>{user.bio}</p>}
        {user.top_repos && user.top_repos.length > 0 && (
          <p>Top ⭐ Repos:
            <ul>
              {user.top_repos.slice(0,3).map(r => (
                <li key={r.name}>
                  <Link to={`/repo/${user.username}/${r.name}`}>{r.name}</Link> ({r.stars}★)
                </li>
              ))}
            </ul>
          </p>
        )}
        <small>Last commit: {user.last_commit || '–'}</small>
      </div>
      <button onClick={() => navigator.clipboard.writeText(window.location.href)}>Embed</button>
    </div>
  )
}
