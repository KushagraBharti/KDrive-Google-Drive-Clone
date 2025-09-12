import { useState } from 'react'
import { useUpload } from '@/hooks/useUpload'
import { toast } from 'sonner'

export interface DropzoneProps {
  parentId: number
  onUploaded?: () => void
  children: React.ReactNode
}

export default function Dropzone({ parentId, onUploaded, children }: DropzoneProps) {
  const { uploadFile } = useUpload()
  const [isDragging, setIsDragging] = useState(false)

  const MAX_SIZE_MB = 10
  const allowedTypes = [
    'image/',
    'video/',
    'text/',
    'application/pdf',
  ]

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    for (const file of files) {
      const tooLarge = file.size > MAX_SIZE_MB * 1024 * 1024
      const typeOk = allowedTypes.some(t => file.type.startsWith(t))
      if (tooLarge || !typeOk) {
        toast.error(
          tooLarge
            ? `File too large (max ${MAX_SIZE_MB}MB)`
            : 'Unsupported file type'
        )
        continue
      }
      await toast.promise(
        uploadFile(file, parentId),
        {
          loading: 'Uploading…',
          success: 'File uploaded',
          error: 'Upload failed',
        }
      )
      onUploaded?.()
    }
    e.dataTransfer.clearData()
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative"
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/80 text-slate-200">
          <p className="text-lg">Drop files to upload</p>
        </div>
      )}
      {children}
    </div>
  )
}
