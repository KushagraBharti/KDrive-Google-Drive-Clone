import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { Button } from './ui/button'
import { useUpload } from '@/hooks/useUpload'

export interface UploadButtonProps {
  parentId: number
  onUploaded?: () => void
}

export default function UploadButton({ parentId, onUploaded }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { uploadFile } = useUpload()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await uploadFile(file, parentId)
      e.target.value = ''
      onUploaded?.()
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
      <Button onClick={() => inputRef.current?.click()}>
        <Upload className="w-4 h-4 mr-2" />
        Upload
      </Button>
    </>
  )
}
