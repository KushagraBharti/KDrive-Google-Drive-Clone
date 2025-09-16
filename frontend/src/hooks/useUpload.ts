import { useAuth } from './useAuth'

export interface UploadCallbacks {
  onProgress?: (progress: number) => void
}

export function useUpload() {
  const { session } = useAuth()

  async function uploadFile(
    file: File,
    parentId: number,
    callbacks?: UploadCallbacks
  ) {
    if (!session) throw new Error('Not authenticated')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('parentId', String(parentId))

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/files')
      xhr.responseType = 'json'
      xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`)
      xhr.setRequestHeader('Accept', 'application/json')

      callbacks?.onProgress?.(0)

      xhr.upload.onprogress = event => {
        if (!callbacks?.onProgress) return
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          callbacks.onProgress(progress)
        }
      }

      xhr.onerror = () => {
        reject(new Error('Upload failed'))
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          callbacks?.onProgress?.(100)
          resolve()
          return
        }

        const response = xhr.response as { error?: string } | null
        const message =
          response?.error || xhr.statusText || 'Upload failed'
        reject(new Error(message))
      }

      xhr.send(formData)
    })
  }

  return { uploadFile }
}
