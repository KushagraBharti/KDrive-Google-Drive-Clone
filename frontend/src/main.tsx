import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'sonner'
import { initPosthog } from './lib/posthog'

initPosthog()

// testing 123

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster richColors />
    </AuthProvider>
  </React.StrictMode>,
)
