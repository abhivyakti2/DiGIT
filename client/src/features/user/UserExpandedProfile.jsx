import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUserDetails } from '../../api/github'

export default function UserExpandedProfile() {
  const { username } = useParams()
  const { data, isLoading, error } = useUserDetails(username)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('stars')

  if (isLoading) return <p>Loading user profile...</p>
  if (error) return <p>Error loading user profile.</p>
  if (!data) return <p>No data found.</p>

  const filteredRepos = useMemo(() => {
    let filtered = data.repositories || []
    if (filter) {
      filtered = filtered.filter(repo => repo.name.toLowerCase().includes(filter.toLowerCase()))
    }
    if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name))
    else filtered.sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0))
    return filtered
  }, [data.repositories, filter, sortBy])

  return (
    <div>
      <h1>{data.username}</h1>
      <p>{data.bio}</p>

      <h3>Repositories</h3>
      <input
        type="text"
        placeholder="Filter by name"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="stars">Stars</option>
        <option value="forks">Forks</option>
        <option value="open_issues">Open Issues</option>
        <option value="name">Name</option>
      </select>

      <ul>
        {filteredRepos.map(repo => (
          <li key={repo.id}>
            <Link to={`/repo/${username}/${repo.name}`}>{repo.name}</Link> - ⭐ {repo.stars} - 🍴 {repo.forks} - Issues: {repo.open_issues}
          </li>
        ))}
      </ul>
    </div>
  )
}
