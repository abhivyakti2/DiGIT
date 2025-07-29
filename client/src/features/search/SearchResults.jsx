import UserProfileCard from '../user/UserProfileCard'
import RepoCard from '../repo/RepoCard'

export default function SearchResults({ profiles, repos }) {
  return (
    <div>
      {profiles.length > 0 && (
        <div>
          <h3>Matching Profiles</h3>
          {profiles.map(user => <UserProfileCard key={user.username} user={user} />)}
        </div>
      )}
      {repos.length > 0 && (
        <div>
          <h3>Matching Repositories</h3>
          {repos.map(repo => <RepoCard key={repo.id} repo={repo} />)}
        </div>
      )}
    </div>
  )
}
