import { File, FileText, ImageIcon, Video, Music, Archive } from 'lucide-react'
import type React from 'react'

export interface FileCardProps {
  name: string
  size?: string
  modified?: string
  onClick?: () => void
}

function getIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className="w-6 h-6 text-blue-400" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <ImageIcon className="w-6 h-6 text-emerald-400" />
    case 'mp4':
    case 'avi':
    case 'mov':
      return <Video className="w-6 h-6 text-purple-400" />
    case 'mp3':
    case 'wav':
      return <Music className="w-6 h-6 text-orange-400" />
    case 'zip':
    case 'rar':
    case '7z':
      return <Archive className="w-6 h-6 text-yellow-400" />
    default:
      return <File className="w-6 h-6 text-slate-400" />
  }
}

export default function FileCard({ name, size, modified, onClick }: FileCardProps) {
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
