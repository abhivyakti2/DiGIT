import React, { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('')
  const [type, setType] = useState('all')

  const doSearch = () => {
    if (value.trim()) onSearch(value.trim(), type)
  }

  return (
    <div style={{ margin: 16 }}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search users or repos"
      />
      <select value={type} onChange={e => setType(e.target.value)} style={{ marginLeft: 8 }}>
        <option value="all">All</option>
        <option value="profiles">Profiles</option>
        <option value="repos">Repositories</option>
      </select>
      <button onClick={doSearch} style={{ marginLeft: 8 }}>Search</button>
    </div>
  )
}
