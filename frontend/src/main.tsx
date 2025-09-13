import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'sonner'
import { initPosthog } from './lib/posthog'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

initPosthog()

// Create a client

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster richColors />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
