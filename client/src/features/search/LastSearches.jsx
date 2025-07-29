import React from 'react'
export default function LastSearches({ last }) {
  return (
    <div style={{ margin: 16 }}>
      <h4>Last 5 Searches</h4>
      <ul>
        {last.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  )
}
