import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/reactQueryClient'


createRoot(document.getElementById('root')).render(
 <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
