
// HomeInfo.jsx
import React from 'react'
import logo from '../assets/Logo.png'

export default function HomeInfo() {
  return (
    <div className="home-info" style={{ textAlign: 'center', marginTop: 50 }}>
<img
      src={logo}
      alt="DiGIT Logo"
      width={460}
      style={{ cursor: 'pointer' }}
          />      <p>Your GitHub Analytics Dashboard.</p>
      <p>Discover profiles, repositories, and AI-powered insights instantly.</p>
    </div>
  )
}
