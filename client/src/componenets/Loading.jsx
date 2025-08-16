import React from 'react'

export default function Loading({ text = 'Loading...' }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '40px 0',
      fontSize: '18px',
      color: '#555'
    }}>
      {text}
    </div>
  )
}
