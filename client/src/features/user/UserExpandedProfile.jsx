import React, { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useUserDetails } from '../../api/github'

export default function UserExpandedProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useUserDetails(username)

  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('stars')
  const [page, setPage] = useState(1)
  const perPage = 9

  const filteredRepos = useMemo(() => {
    let filtered = data?.repositories || []
    if (filter) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(filter.toLowerCase())
      )
    }
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      filtered.sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0))
    }
    return filtered
  }, [data?.repositories, filter, sortBy])

  // Pagination logic
  const totalPages = Math.ceil(filteredRepos.length / perPage)
  const paginatedRepos = filteredRepos.slice((page - 1) * perPage, page * perPage)

  if (isLoading) return <p>Loading user profile...</p>
  if (error) return <p>Error loading user profile.</p>
  if (!data) return <p>No data found.</p>

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>

      {/* 🧭 Navbar with Back Link */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        
      </div>

      {/* 👤 User Info */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <img
          src={data.avatar}
          alt={`${data.username}'s avatar`}
          style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '16px' }}
        />
        <div>
          <h2 style={{ margin: '0', color: '#fff' }}>{data.username}</h2>
          {data.bio && (
            <p style={{ margin: '6px 0 0', color: '#aaa' }}>{data.bio}</p>
          )}
        </div>
      </div>

      {/* 🔍 Controls & Heading */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '60px', marginBottom: '16px',
        alignItems: 'center',
        margin: '16px 0'
      }}>
<h2 style={{ color: '#fff' }}>Repositories</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '8px 24px 8px 8px', // extra right padding for arrow
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              appearance: 'none',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              backgroundImage:
                'linear-gradient(45deg, transparent 50%, #ccc 50%), linear-gradient(135deg, #ccc 50%, transparent 50%)',
              backgroundPosition: 'calc(100% - 12px) calc(1em + 2px), calc(100% - 8px) calc(1em + 2px)',
              backgroundSize: '5px 5px, 5px 5px',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <option value="stars">Stars</option>
            <option value="forks">Forks</option>
            <option value="open_issues">Open Issues</option>
            <option value="name">Name</option>
          </select>
          <input
            type="text"
            placeholder="Filter repos by name"
            value={filter}
            onChange={e => {
              setPage(1) // reset to first page when filtering
              setFilter(e.target.value)
            }}
            style={{
              width: '180px',
              padding: '8px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      {/* 📦 Repository Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {paginatedRepos.map(repo => (
          <div
            key={repo.id}
            style={{
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              backgroundColor: '#1a1a1a',
              transition: 'background-color 0.25s, border-color 0.25s'
            }}
            className="repo-card"
          >
            <Link
              to={`/repo/${username}/${repo.name}`}
              style={{
                fontWeight: 'bold',
                color: '#0366d6',
                textDecoration: 'none',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              {repo.name}
            </Link>
            {/* ✅ New — Description */}
  {repo.description && (
    <p style={{ fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>
      {repo.description}
    </p>
  )}

  {/* ✅ New — Languages */}
  {repo.languages && repo.languages.length > 0 && (
    <div style={{ fontSize: '12px', color: '#bbb', marginBottom: '6px' }}>
      <strong>Languages:</strong> {repo.languages.join(', ')}
    </div>
  )}
            <div style={{ fontSize: '14px', color: '#aaa' }}>
              ⭐ {repo.stars} &nbsp;&nbsp; 🍴 {repo.forks} &nbsp;&nbsp; 🐛 {repo.open_issues}
            </div>
          </div>
        ))}
      </div>

      {/* 📄 Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '8px' }}>
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            style={{
padding: '3px 10px',
    lineHeight: '1.5', // Ensures text is centered
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',              backgroundColor: '#0366d6',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.5 : 1
            }}
          >
            Prev
          </button>
          <span style={{ padding: '5px', color: '#fff' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            style={{
padding: '3px 10px',
    lineHeight: '1.5', // Ensures text is centered
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',              backgroundColor: '#0366d6',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              opacity: page === totalPages ? 0.5 : 1
            }}
          >
            Next
          </button>
        </div>
      )}

      {filteredRepos.length === 0 && (
        <p style={{ marginTop: '20px' }}>No repositories found for the given filter.</p>
      )}

    </div>
  )
}



