import { Folder } from 'lucide-react'
import type React from 'react'

export interface FolderCardProps {
  name: string
  modified?: string
  onClick?: () => void
}

export default function FolderCard({ name, modified, onClick }: FolderCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center space-x-3 text-left hover:bg-slate-800/40 p-2 rounded-md w-full"
    >
      <Folder className="w-6 h-6 text-blue-400" />
      <div className="flex flex-col flex-1">
        <span className="font-medium text-slate-200">{name}</span>
        {modified && <span className="text-sm text-slate-400">{modified}</span>}
      </div>
    </button>
  )
}
