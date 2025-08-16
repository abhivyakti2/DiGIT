import React from 'react'

export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="loading-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-16) 0',
      textAlign: 'center'
    }}>
      <div className="loading-spinner" style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--border)',
        borderTop: '3px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: 'var(--space-4)'
      }}></div>
      <p style={{
        fontSize: '1.1rem',
        color: 'var(--text-secondary)',
        fontWeight: '500'
      }}>
        {text}
      </p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
