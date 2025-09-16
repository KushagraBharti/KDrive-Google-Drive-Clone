import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { Button } from './ui/button'
import { useUpload } from '@/hooks/useUpload'
import { toast } from 'sonner'

export interface UploadButtonProps {
  parentId: number
  onUploaded?: () => void
  className?: string
}

export default function UploadButton({ parentId, onUploaded, className }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { uploadFile } = useUpload()

  const MAX_SIZE_MB = 10
  const allowedTypes = [
    'image/',
    'video/',
    'text/',
    'application/pdf',
  ]

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const tooLarge = file.size > MAX_SIZE_MB * 1024 * 1024
    const typeOk = allowedTypes.some(t => file.type.startsWith(t))
    if (tooLarge || !typeOk) {
      toast.error(
        tooLarge
          ? `File too large (max ${MAX_SIZE_MB}MB)`
          : 'Unsupported file type'
      )
      e.target.value = ''
      return
    }

    try {
      await toast.promise(
        uploadFile(file, parentId),
        {
          loading: 'Uploading…',
          success: 'File uploaded',
          error: 'Upload failed',
        }
      )
      onUploaded?.()
    } finally {
      e.target.value = ''
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      <Button onClick={() => inputRef.current?.click()} className={className}>
        <Upload className="w-4 h-4 mr-2" />
        Upload
      </Button>
    </>
  )
}
