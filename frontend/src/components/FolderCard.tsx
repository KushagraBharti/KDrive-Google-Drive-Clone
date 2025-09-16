import { Folder } from 'lucide-react'
import type React from 'react'

export interface FolderCardProps {
  name: string
  modified?: string
  onClick?: () => void
  view?: 'grid' | 'list'
}

export default function FolderCard({
  name,
  modified,
  onClick,
  view = 'list',
}: FolderCardProps) {
  if (view === 'grid') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full flex-col items-center justify-center space-y-2"
      >
        <Folder className="w-12 h-12 text-blue-400" />
        <span className="w-full truncate text-center text-sm font-medium text-foreground">
          {name}
        </span>
        {modified && (
          <span className="w-full truncate text-center text-xs text-muted-foreground">
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
      className="flex w-full items-center space-x-3 rounded-md p-2 text-left transition-colors hover:bg-muted/60"
    >
      <Folder className="w-6 h-6 text-blue-400" />
      <div className="flex flex-col flex-1">
        <span className="font-medium text-foreground">{name}</span>
        {modified && <span className="text-sm text-muted-foreground">{modified}</span>}
      </div>
    </button>
  )
}
