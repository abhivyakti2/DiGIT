import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/Logo.png'

export default function Logo() {
  const navigate = useNavigate()

  return (
    <img
      src={logo}
      alt="DiGIT Logo"
      width={120}
      style={{ cursor: 'pointer' }}
      
      onClick={() => navigate('/')}
    />
  )
}
