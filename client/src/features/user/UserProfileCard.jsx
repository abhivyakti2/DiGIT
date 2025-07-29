import { Link } from 'react-router-dom'
export default function UserProfileCard({ user }) {
  // Show bio, username, top 3 starred repos, top languages, last commit date.
  return (
    <div className="profile-card">
      <img src={user.avatar} alt="Avatar" width={80} />
      <h4>{user.username}</h4>
      <p>{user.bio}</p>
      <p>Most Starred:
        <ul>
          {user.top_repos?.map(r => (
            <li key={r.name}>{r.name} ({r.stars}★)</li>
          ))}
        </ul>
      </p>
      <button onClick={() => navigator.clipboard.writeText(window.location.href)}>Embed Link</button>
      <Link to={`/profile/${user.username}`}>Expand</Link>
    </div>
  )
}
