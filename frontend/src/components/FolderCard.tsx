import { Folder as FolderIcon } from 'lucide-react'
import type { Folder } from '@prisma/client'
import type React from 'react'

export interface FolderCardProps {
  folder: Folder
  modified?: string
  onClick?: () => void
  view?: 'grid' | 'list'
}

export default function FolderCard({
  folder,
  modified,
  onClick,
  view = 'list',
}: FolderCardProps) {
  const { name } = folder
  if (view === 'grid') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex flex-col items-center justify-center space-y-2 w-full"
      >
        <FolderIcon className="w-12 h-12 text-blue-400" />
        <span className="text-sm font-medium text-slate-200 truncate w-full text-center">
          {name}
        </span>
        {modified && (
          <span className="text-xs text-slate-400 truncate w-full text-center">
            {modified}
          </span>
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center space-x-3 text-left hover:bg-slate-800/40 p-2 rounded-md w-full"
    >
      <FolderIcon className="w-6 h-6 text-blue-400" />
      <div className="flex flex-col flex-1">
        <span className="font-medium text-slate-200">{name}</span>
        {modified && <span className="text-sm text-slate-400">{modified}</span>}
      </div>
    </button>
  )
}
