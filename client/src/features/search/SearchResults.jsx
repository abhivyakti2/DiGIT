import React from 'react'
import { useSearchProfiles, useSearchRepos } from '../../api/github'
import UserProfileCard from '../user/UserProfileCard'
import RepoCard from '../repo/RepoCard'

export default function SearchResults({ query, type }) {
  const { data: profiles = [] } = useSearchProfiles(query)
  const { data: repos = [] } = useSearchRepos(query)

  return (
    <div style={{ padding: '0 16px' }}>
      {(type === 'all' || type === 'profiles') && profiles.length > 0 && (
        <div>
          <h3>Matching Profiles</h3>
          <div style={gridStyle}>
            {profiles.map(u => (
              <UserProfileCard key={u.username} user={u} />
            ))}
          </div>
        </div>
      )}

      {(type === 'all' || type === 'repos') && repos.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Matching Repositories</h3>
          <div style={gridStyle}>
            {repos.map(r => (
              <RepoCard key={r.id} repo={r} />
            ))}
          </div>
        </div>
      )}

      {!profiles.length && !repos.length && (
        <p>No results found for "{query}"</p>
      )}
    </div>
  )
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '16px',
  marginTop: '12px',
}
