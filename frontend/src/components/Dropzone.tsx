import { useState, PropsWithChildren } from 'react'
import { useUpload } from '@/hooks/useUpload'
import { toast } from 'sonner'

export interface DropzoneProps extends PropsWithChildren {
  parentId: number
  onUploaded?: () => void
}

export default function Dropzone({ parentId, onUploaded, children }: DropzoneProps) {
  const { uploadFile } = useUpload()
  const [isDragging, setIsDragging] = useState(false)

  const MAX_SIZE_MB = 10
  const allowedTypes = ['image/', 'video/', 'text/', 'application/pdf']

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setIsDragging(false)
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)

    for (const file of files) {
      const tooLarge = file.size > MAX_SIZE_MB * 1024 * 1024
      const typeOk = allowedTypes.some(t => file.type.startsWith(t))

      if (tooLarge || !typeOk) {
        toast.error(
          tooLarge ? `File too large (max ${MAX_SIZE_MB}MB)` : 'Unsupported file type'
        )
        continue
      }

      await toast.promise(uploadFile(file, parentId), {
        loading: 'Uploading…',
        success: 'File uploaded',
        error: 'Upload failed',
      })
    }

    if (files.length > 0) {
      onUploaded?.()
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative"
    >
      {children}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg border-2 border-dashed border-slate-500 bg-slate-900/80">
          <p className="text-slate-300 text-lg">Drop files to upload</p>
        </div>
      )}
    </div>
  )
}

