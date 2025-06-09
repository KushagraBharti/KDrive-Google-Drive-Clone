import { File, FileText, ImageIcon, Video, Music, Archive } from 'lucide-react'
import type React from 'react'

export interface FileCardProps {
  name: string
  size?: string
  modified?: string
  onClick?: () => void
  view?: 'grid' | 'list'
}

function getIcon(fileName: string, big = false) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const size = big ? 'w-12 h-12' : 'w-6 h-6'
  switch (ext) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className={`${size} text-blue-400`} />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <ImageIcon className={`${size} text-emerald-400`} />
    case 'mp4':
    case 'avi':
    case 'mov':
      return <Video className={`${size} text-purple-400`} />
    case 'mp3':
    case 'wav':
      return <Music className={`${size} text-orange-400`} />
    case 'zip':
    case 'rar':
    case '7z':
      return <Archive className={`${size} text-yellow-400`} />
    default:
      return <File className={`${size} text-slate-400`} />
  }
}

export default function FileCard({
  name,
  size,
  modified,
  onClick,
  view = 'list',
}: FileCardProps) {
  if (view === 'grid') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex flex-col items-center justify-center space-y-2 w-full"
      >
        {getIcon(name, true)}
        <span className="text-sm font-medium text-slate-200 truncate w-full text-center">
          {name}
        </span>
        {(size || modified) && (
          <span className="text-xs text-slate-400 truncate w-full text-center">
            {modified}
            {modified && size && ' • '}
            {size}
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
      {getIcon(name)}
      <div className="flex flex-col flex-1">
        <span className="font-medium text-slate-200">{name}</span>
        {(size || modified) && (
          <span className="text-sm text-slate-400">
            {modified}
            {modified && size && ' • '}
            {size}
          </span>
        )}
      </div>
    </button>
  )
}
