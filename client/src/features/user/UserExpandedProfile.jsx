import React, { useState } from 'react'
import { useUserDetails } from '../../api/github'

export default function UserExpandedProfile({ username }) {
  const { data } = useUserDetails(username)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('stars')
  let repos = (data?.repositories || []).filter(r =>
    r.name.toLowerCase().includes(filter.toLowerCase()))
  if (sortBy !== 'name') { repos.sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0)) }
  else { repos.sort((a, b) => a.name.localeCompare(b.name)) }
  return (
    <div>
      <h2>{username}</h2>
      <p>{data?.bio}</p>
      <input placeholder="Filter by name" onChange={e => setFilter(e.target.value)} />
      <select onChange={e => setSortBy(e.target.value)}>
        <option value="stars">Stars</option>
        <option value="forks">Forks</option>
        <option value="issues">Open Issues</option>
        <option value="name">Name</option>
      </select>
      <ul>
        {repos.map(repo => <li key={repo.id}>{repo.name} ({repo.stars}★)</li>)}
      </ul>
    </div>
  )
}
