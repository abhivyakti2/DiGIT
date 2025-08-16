
// HomeInfo.jsx
import React from 'react'
import logo from '../assets/Logo.png'

export default function HomeInfo() {
  return (
    <div className="home-info animate-fade-in" style={{ 
      textAlign: 'center', 
      marginTop: 'var(--space-12)',
      padding: 'var(--space-8)'
    }}>
      <img
        src={logo}
        alt="DiGIT Logo"
        width={460}
        style={{ 
          cursor: 'pointer',
          maxWidth: '100%',
          height: 'auto',
          filter: 'drop-shadow(0 10px 20px rgba(59, 130, 246, 0.3))'
        }}
      />
      <div style={{ marginTop: 'var(--space-8)' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Your GitHub Analytics Dashboard
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Discover profiles, repositories, and AI-powered insights instantly. 
          Search through millions of GitHub users and projects with advanced analytics.
        </p>
      </div>
    </div>
  )
}
