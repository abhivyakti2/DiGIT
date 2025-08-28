import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/Logo.png'

export default function Logo() {
  const navigate = useNavigate()

  return (
    <img
      src={logo}
      alt="DiGIT Logo"
      width={130}
      style={{ cursor: 'pointer',  position: 'relative',
      top: '-10px' }}
      
      onClick={() => navigate('/')}
    />
  )
}
