import { Link } from 'react-router-dom'
export default function RepoCard({ repo }) {
  return (
    <div className="repo-card">
      <h4>{repo.name}</h4>
      <p>{repo.description}</p>
      <p>⭐ {repo.stars} | Last Commit: {repo.last_commit}</p>
      {repo.website && <a href={repo.website} target="_blank" rel="noreferrer">Site</a>}
      <button onClick={() => navigator.clipboard.writeText(window.location.href)}>Embed Link</button>
      <Link to={`/repo/${repo.owner}/${repo.name}`}>Expand</Link>
    </div>
  )
}
