// src/hooks/useDrive.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { supabaseClient } from "@/lib/supabaseClient"

export interface Folder {
  id: number
  name: string
  parentId: number | null
  ownerId: string
  createdAt: string
}

export interface DriveFile {
  id: number
  name: string
  size: number
  url: string
  parentId: number
  ownerId: string
  createdAt: string
}

export function useFolders(
  parentId: number | null
): UseQueryResult<Folder[], Error> {
  return useQuery<Folder[], Error>({
    queryKey: ["folders", parentId],
    queryFn: async (): Promise<Folder[]> => {
      const { data, error } = await supabaseClient
        .from("folder")       // ← no generic here
        .select("*")          // ← no generic here either
        .eq("parentId", parentId)
        .order("id", { ascending: true })

      if (error) throw error
      // cast the unknown[] → Folder[]
      return (data as Folder[]) 
    },
  })
}

export function useFiles(
  parentId: number
): UseQueryResult<DriveFile[], Error> {
  return useQuery<DriveFile[], Error>({
    queryKey: ["files", parentId],
    queryFn: async (): Promise<DriveFile[]> => {
      const { data, error } = await supabaseClient
        .from("file")
        .select("*")
        .eq("parentId", parentId)
        .order("id", { ascending: true })

      if (error) throw error
      return data as DriveFile[]
    },
  })
}

export async function createFolder(
  name: string,
  parentId: number | null,
  ownerId: string
) {
  const { data, error } = await supabaseClient
    .from('folder')
    .insert([{ name, parentId, ownerId }])
    .single()

  if (error) throw error
  return data as Folder
}

export async function uploadFile(
  fileBlob: File,
  parentId: number,
  ownerId: string
) {
  const path = `${ownerId}/${Date.now()}-${fileBlob.name}`
  const { error: storageError } = await supabaseClient.storage
    .from('drive')
    .upload(path, fileBlob)

  if (storageError) throw storageError

  const { data, error } = await supabaseClient
    .from('file')
    .insert([{ name: fileBlob.name, size: fileBlob.size, url: path, parentId, ownerId }])
    .single()

  if (error) throw error
  return data as DriveFile
}

export async function deleteFile(id: number, path: string) {
  const { error: dbError } = await supabaseClient.from('file').delete().eq('id', id)
  if (dbError) throw dbError
  // ignore storage errors
  await supabaseClient.storage.from('drive').remove([path])
}

