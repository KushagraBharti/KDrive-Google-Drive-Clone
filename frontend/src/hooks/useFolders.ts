import { type Folder } from '@prisma/client'
import { useAuth } from './useAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useFolders(parentId: number | null) {
  const { session } = useAuth()
  const token = session?.access_token
  const queryClient = useQueryClient()

  const fetchFolders = async (): Promise<Folder[]> => {
    if (!token) return []
    const res = await fetch(`/api/folders/${parentId ?? ''}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      throw new Error('Failed to fetch folders')
    }
    return res.json()
  }

  const { data = [], ...query } = useQuery({
    queryKey: ['folders', parentId, token],
    queryFn: fetchFolders,
    enabled: !!token
  })

  const renameMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      if (!token) throw new Error('No session')
      const res = await fetch(`/api/folders/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      })
      if (!res.ok) {
        throw new Error('Failed to rename folder')
      }
      return res.json() as Promise<Folder>
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Folder[]>(['folders', parentId, token], (old = []) =>
        old.map((f) => (f.id === data.id ? data : f))
      )
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('No session')
      await fetch(`/api/folders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      return id
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Folder[]>(['folders', parentId, token], (old = []) =>
        old.filter((f) => f.id !== id)
      )
    }
  })

  return {
    folders: data,
    ...query,
    renameFolder: (id: number, name: string) => renameMutation.mutateAsync({ id, name }),
    deleteFolder: (id: number) => deleteMutation.mutateAsync(id)
  }
}

