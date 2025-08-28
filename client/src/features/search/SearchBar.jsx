import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { setCurrentQuery, setCurrentType, addRecentSearch } from '../../store/slices/searchSlice'

export default function SearchBar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { currentQuery, currentType } = useAppSelector(state => state.search)

  const [value, setValue] = useState(currentQuery)
  const [type, setType] = useState(currentType)

  useEffect(() => {
    const queryParam = searchParams.get('q') || ''
    const typeParam = searchParams.get('type') || 'profiles'
    setValue(queryParam)
    setType(typeParam)
    dispatch(setCurrentQuery(queryParam))
    dispatch(setCurrentType(typeParam))
  }, [searchParams])

  const doSearch = () => {
    if (value.trim()) {
      dispatch(addRecentSearch(value.trim()))
      dispatch(setCurrentQuery(value.trim()))
      dispatch(setCurrentType(type))
      navigate(`/search?q=${encodeURIComponent(value.trim())}&type=${type}`)
    }
  }
const inputRef = React.useRef(null);

const clearInput = () => {
  setValue('');
  dispatch(setCurrentQuery(''));
  // Stay on the current page and update only the query param
  navigate(`/search?q=&type=${type}`);
  // Refocus the input
  setTimeout(() => inputRef.current?.focus(), 0); // Next tick to ensure DOM updated
};


  const onKeyDown = (e) => {
    if (e.key === 'Enter') doSearch()
  }

  return (
    <div
      className="search-container"
      style={{
        textAlign: 'center',
        marginTop: 'var(--space-12)',
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--space-4)',
        alignItems: 'center'
      }}
    >
      {/* Input + clear */}
      <div className="search-input-container" style={{ position: 'relative' }}>
        <input
          type="text"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search users or repositories..."
          style={{
            ...fieldStyle,
            width: '280px',
            paddingRight: 'var(--space-10)',
            fontSize: '1rem',
            height: '48px',
            background: 'var(--bg-secondary)',
            border: '2px solid var(--border)',
            boxShadow: 'var(--shadow-lg)'
          }}
        />
        {value && (
          <button
            onClick={clearInput}
            aria-label="Clear"
            className="clear-button"
            style={{
              ...buttonResetStyle,
              position: 'absolute',
              right: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1rem',
              color: 'var(--text-muted)',
              padding: 'var(--space-1)',
              lineHeight: 1,
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✖
          </button>
        )}
      </div>

      {/* Type select */}
      <select
  value={type}
  onChange={e => {
    const newType = e.target.value;
    setType(newType);
    dispatch(setCurrentType(newType));
    navigate(`/search?q=${encodeURIComponent(value.trim())}&type=${e.target.value}`);
    setTimeout(() => inputRef.current?.focus(), 0);
  }}
  onKeyDown={onKeyDown}
  className="search-select"
  style={{
    ...fieldStyle,
    width: '160px',
    cursor: 'pointer',
    fontSize: '1rem',
    height: '48px',
    background: 'var(--bg-secondary)',
    border: '2px solid var(--border)',
    boxShadow: 'var(--shadow-lg)'
  }}
>
  <option value="profiles">Profiles</option>
  <option value="repos">Repositories</option>
</select>


      {/* Search button */}
      <button onClick={doSearch} className="btn-primary" style={{
        ...primaryButtonStyle,
        height: '48px',
        padding: '0 var(--space-8)',
        fontSize: '1rem',
        fontWeight: '600'
      }}>
        Search
      </button>
    </div>
  )
}

/* ===== Styles ===== */

const buttonResetStyle = {
  outline: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

const primaryButtonStyle = {
  ...buttonResetStyle,
  padding: 'var(--space-3) var(--space-6)',
  borderRadius: 'var(--radius)',
  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
  border: '2px solid var(--primary)',
  color: '#fff',
  boxShadow: 'var(--shadow-lg)'
}

const fieldStyle = {
  padding: 'var(--space-3) var(--space-4)',
  fontSize: '0.875rem',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  outline: 'none',
  boxSizing: 'border-box',
  lineHeight: '1.5',
  transition: 'all 0.2s ease'
}
