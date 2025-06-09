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

export interface File {
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
): UseQueryResult<File[], Error> {
  return useQuery<File[], Error>({
    queryKey: ["files", parentId],
    queryFn: async (): Promise<File[]> => {
      const { data, error } = await supabaseClient
        .from("file")
        .select("*")
        .eq("parentId", parentId)
        .order("id", { ascending: true })

      if (error) throw error
      return (data as File[])
    },
  })
}
