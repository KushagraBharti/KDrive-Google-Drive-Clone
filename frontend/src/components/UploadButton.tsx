import { useCallback, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'

import { useUpload } from '@/hooks/useUpload'
import { cn } from '@/utils/helpers'

import { Button } from './ui/button'

export interface UploadButtonProps {
  parentId: number
  onUploaded?: () => void
  className?: string
}

type UploadStatus = 'uploading' | 'success' | 'error'

interface UploadTask {
  id: string
  fileName: string
  progress: number
  status: UploadStatus
  error?: string
}

const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ALLOWED_TYPES = ['image/', 'video/', 'text/', 'application/pdf']

function createUploadId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export default function UploadButton({ parentId, onUploaded, className }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { uploadFile } = useUpload()
  const [uploads, setUploads] = useState<UploadTask[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const updateUpload = useCallback((id: string, data: Partial<UploadTask>) => {
    setUploads(prev =>
      prev.map(upload => (upload.id === id ? { ...upload, ...data } : upload))
    )
  }, [])

  const handleSingleFile = useCallback(
    (file: File) => {
      const tooLarge = file.size > MAX_SIZE_BYTES
      const typeAllowed = ALLOWED_TYPES.some(type => file.type.startsWith(type))

      if (tooLarge || !typeAllowed) {
        toast.error(
          tooLarge
            ? `File too large (max ${MAX_SIZE_MB}MB)`
            : 'Unsupported file type'
        )
        return
      }

      const uploadId = createUploadId()
      setUploads(prev => [
        ...prev,
        {
          id: uploadId,
          fileName: file.name,
          progress: 0,
          status: 'uploading',
        },
      ])

      uploadFile(file, parentId, {
        onProgress: progress => updateUpload(uploadId, { progress }),
      })
        .then(() => {
          updateUpload(uploadId, { progress: 100, status: 'success' })
          toast.success(`${file.name} uploaded`)
          onUploaded?.()
        })
        .catch(error => {
          const message =
            error instanceof Error ? error.message : 'Upload failed'
          updateUpload(uploadId, { status: 'error', error: message })
          toast.error(message)
        })
    },
    [onUploaded, parentId, updateUpload, uploadFile]
  )

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList?.length) return
      Array.from(fileList).forEach(handleSingleFile)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [handleSingleFile]
  )

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleFiles(event.target.files)
    },
    [handleFiles]
  )

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)
      const files = event.dataTransfer?.files
      if (files?.length) {
        handleFiles(files)
      }
      event.dataTransfer?.clearData()
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const nextTarget = event.relatedTarget as Node | null
    if (nextTarget && event.currentTarget.contains(nextTarget)) {
      return
    }
    setIsDragging(false)
  }, [])

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/30 hover:border-primary/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleChange}
        />
        <Button type="button" onClick={() => inputRef.current?.click()} className={className}>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          or drag and drop files here
        </p>
      </div>

      {uploads.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploads.map(upload => (
            <div key={upload.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span className="max-w-[60%] truncate" title={upload.fileName}>
                  {upload.fileName}
                </span>
                <span>
                  {upload.status === 'success'
                    ? 'Uploaded'
                    : upload.status === 'error'
                      ? 'Failed'
                      : `${upload.progress}%`}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    upload.status === 'error' ? 'bg-destructive' : 'bg-primary'
                  )}
                  style={{
                    width: `${
                      upload.status === 'error'
                        ? 100
                        : Math.min(upload.progress, 100)
                    }%`,
                  }}
                />
              </div>
              {upload.status === 'error' && upload.error && (
                <p className="text-xs text-destructive">{upload.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
