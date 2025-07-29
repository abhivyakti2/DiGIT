import React, { useState } from 'react'
import ExportCSV from './ExportCSV'

export default function RepoTable({ repos = [] }) {
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('stars')
  const [sortOrderAsc, setSortOrderAsc] = useState(false)

  const filteredRepos = repos.filter(r =>
    r.name.toLowerCase().includes(filter.toLowerCase())
  )

  const sortedRepos = filteredRepos.sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrderAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    }
    return sortOrderAsc
      ? a[sortBy] - b[sortBy]
      : b[sortBy] - a[sortBy]
  })

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrderAsc(!sortOrderAsc)
    } else {
      setSortBy(field)
      setSortOrderAsc(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Filter by repo name"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <label>Sort By:</label>
        {['name', 'stars', 'forks', 'open_issues'].map((field) => (
          <button key={field} onClick={() => toggleSort(field)} style={{ marginLeft: 5 }}>
            {field} {sortBy === field ? (sortOrderAsc ? '▲' : '▼') : ''}
          </button>
        ))}
      </div>
      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Stars</th>
            <th>Forks</th>
            <th>Open Issues</th>
          </tr>
        </thead>
        <tbody>
          {sortedRepos.map((repo) => (
            <tr key={repo.id}>
              <td>{repo.name}</td>
              <td>{repo.description || '--'}</td>
              <td>{repo.stars}</td>
              <td>{repo.forks}</td>
              <td>{repo.open_issues}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 10 }}>
        <ExportCSV data={sortedRepos} filename="repositories.csv" />
      </div>
    </div>
  )
}
