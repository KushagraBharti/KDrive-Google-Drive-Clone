import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const nav = useNavigate()

  return (
    <header className="bg-slate-800 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">KDrive</Link>
      {user ? (
        <div className="space-x-4">
          <span>{user.email}</span>
          <Button variant="outline" size="sm" onClick={() => { signOut(); nav('/') }}>
            Sign Out
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => nav('/signin')}>
          Sign In
        </Button>
      )}
    </header>
  )
}
