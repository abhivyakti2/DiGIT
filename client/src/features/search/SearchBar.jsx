import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function SearchBar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [value, setValue] = useState('')
  const [type, setType] = useState('all')

  useEffect(() => {
    setValue(searchParams.get('q') || '')
    setType(searchParams.get('type') || 'all')
  }, [searchParams])

  const doSearch = () => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}&type=${type}`)
    }
  }

  const clearInput = () => {
    setValue('')
    navigate('/')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') doSearch()
  }

  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: 50,
        display: 'flex',
        justifyContent: 'center',
        gap: '12px'
      }}
    >
      {/* Input + clear */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search users or repos"
          style={{
            ...fieldStyle,
            width: '220px',
            paddingRight: '28px',
            backgroundColor: '#1a1a1a'
          }}
        />
        {value && (
          <button
            onClick={clearInput}
            aria-label="Clear"
            style={{
              ...buttonResetStyle,
              position: 'absolute',
              right: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              color: '#555',
              padding: 0,
              lineHeight: 1,
              background: 'transparent',
              border: 'none'
            }}
          >
            ✖
          </button>
        )}
      </div>

      {/* Type select */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        onKeyDown={onKeyDown}
        style={{
          ...fieldStyle,
          width: '220px',
          cursor: 'pointer'
        }}
        onFocus={(e) => (e.target.style.borderColor = '#007bff')}
        onBlur={(e) => (e.target.style.borderColor = '#007bff')}
      >
        <option value="all">All</option>
        <option value="profiles">Profiles</option>
        <option value="repos">Repositories</option>
      </select>

      {/* Search button */}
      <button onClick={doSearch} style={primaryButtonStyle}>
        Search
      </button>
    </div>
  )
}

/* ===== Styles ===== */

const buttonResetStyle = {
  outline: 'none',
  cursor: 'pointer'
}

const primaryButtonStyle = {
  ...buttonResetStyle,
  padding: '6px 16px',
  borderRadius: '4px',
 
  color: '#fff',
  height: '34px'
}

const fieldStyle = {
  padding: '6px 10px',
  fontSize: '14px',
  border: '1px solid #646cff', // match button border color
  borderRadius: '4px',
  outline: 'none',
  boxSizing: 'border-box',
  height: '34px', // match button height
  lineHeight: '20px' // makes text vertically centered
}
