import React from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { setCurrentQuery, addRecentSearch, clearRecentSearches } from '../../store/slices/searchSlice'
import { useNavigate } from 'react-router-dom'

export default function RecentSearches() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { recentSearches, currentType } = useAppSelector(state => state.search)

  const handleRecentSearchClick = (query) => {
    dispatch(setCurrentQuery(query))
    dispatch(addRecentSearch(query))
    navigate(`/search?q=${encodeURIComponent(query)}&type=${currentType}`)
  }

  const handleClearAll = () => {
    dispatch(clearRecentSearches())
  }

  if (recentSearches.length === 0) {
    return null
  }

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow)',
      marginTop: 'var(--space-6)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-4)'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: '600',
          color: 'var(--text-primary)'
        }}>
          Recent Searches
        </h3>
        <button
          onClick={handleClearAll}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 'var(--space-2) var(--space-3)',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'var(--error)'
            e.target.style.color = 'var(--error)'
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'var(--border)'
            e.target.style.color = 'var(--text-muted)'
          }}
        >
          Clear All
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-2)'
      }}>
        {recentSearches.map((query, index) => (
          <button
            key={index}
            onClick={() => handleRecentSearchClick(query)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: 'var(--space-2) var(--space-4)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--primary)'
              e.target.style.background = 'var(--primary-light)'
              e.target.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border)'
              e.target.style.background = 'var(--bg-tertiary)'
              e.target.style.transform = 'translateY(0)'
            }}
            title={query}
          >
            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>🔍</span>
            {query}
          </button>
        ))}
      </div>
    </div>
  )
}