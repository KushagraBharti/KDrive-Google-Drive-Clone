import { type File as PrismaFile } from '@prisma/client'
import { useAuth } from './useAuth'
import { useQuery } from '@tanstack/react-query'

export function useFiles(parentId: number) {
  const { session } = useAuth()
  const token = session?.access_token

  const fetchFiles = async (): Promise<PrismaFile[]> => {
    if (!token) return []
    const res = await fetch(`/api/files/${parentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      throw new Error('Failed to fetch files')
    }
    return res.json()
  }

  const { data = [], ...query } = useQuery({
    queryKey: ['files', parentId, token],
    queryFn: fetchFiles,
    enabled: !!token
  })

  return { files: data, ...query }
}

