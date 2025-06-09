import { Cloud } from 'lucide-react'
import { Button } from './ui/button'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar() {
  const { signOut } = useAuth()

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
      <div className="flex items-center space-x-2">
        <Cloud className="w-5 h-5 text-white" />
        <span className="text-lg font-bold text-white">KDrive</span>
      </div>
      <Button variant="ghost" onClick={signOut} className="text-slate-300 hover:text-white">
        Sign Out
      </Button>
    </nav>
  )
}
