// src/pages/DriveView.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabaseClient"
import { useAuth } from "@/hooks/useAuth"
import { useQueryClient } from "@tanstack/react-query"
import {
  Folder as FolderIcon,
  File as FileIcon,
} from "lucide-react"
import {
  useFolders,
  useFiles,
  Folder,
  DriveFile,
  uploadFile,
  createFolder,
  deleteFile,
} from "@/hooks/useDrive"

interface Breadcrumb {
  id: number | null
  label: string
}

export default function DriveView() {
  const { user, signOut } = useAuth()
  const queryClient = useQueryClient()
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([
    { id: null, label: "My Drive" },
  ])

  const {
    data: folders = [],
    isLoading: loadingFolders,
    isError: foldersError,
  } = useFolders(currentFolderId)
  const {
    data: files = [],
    isLoading: loadingFiles,
    isError: filesError,
  } = useFiles(currentFolderId ?? 0)

  const loading = loadingFolders || loadingFiles
  const error = foldersError || filesError

  // update breadcrumb trail
  useEffect(() => {
    if (currentFolderId === null) {
      setBreadcrumbs([{ id: null, label: "My Drive" }])
    } else {
      const found = folders.find((f) => f.id === currentFolderId)
      const label = found ? found.name : "…"
      setBreadcrumbs((prev) => [...prev, { id: currentFolderId, label }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolderId])

  function navigateToFolder(id: number | null) {
    setBreadcrumbs((prev) => {
      const idx = prev.findIndex((c) => c.id === id)
      return idx >= 0 ? prev.slice(0, idx + 1) : prev
    })
    setCurrentFolderId(id)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="p-4 bg-gray-800 flex items-center justify-between text-sm">
        <div className="space-x-2">
          {breadcrumbs.map((crumb, i) => (
            <button
              key={i}
              onClick={() => navigateToFolder(crumb.id)}
              className="hover:underline"
            >
              {crumb.label}
              {i < breadcrumbs.length - 1 && " › "}
            </button>
          ))}
        </div>
        {user && (
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        )}
      </nav>

      <main className="p-6">
        <div className="mb-4 flex gap-4">
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              if (!user) return
              await uploadFile(file, currentFolderId ?? 0, user.id)
              queryClient.invalidateQueries({ queryKey: ["files", currentFolderId ?? 0] })
            }}
          />
          <Button asChild>
            <label htmlFor="file-input" className="cursor-pointer">
              Upload File
            </label>
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const name = prompt('Folder name')?.trim()
              if (!name) return
              if (!user) return
              await createFolder(name, currentFolderId, user.id)
              queryClient.invalidateQueries({ queryKey: ["folders", currentFolderId] })
            }}
          >
            New Folder
          </Button>
        </div>
        {loading && <p>Loading…</p>}
        {error && <p className="text-red-400">Error loading data</p>}

        {!loading && !error && folders.length === 0 && files.length === 0 && (
          <p className="text-center text-gray-500">This folder is empty</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {folders.map((f: Folder) => (
            <Card
              key={f.id}
              onClick={() => navigateToFolder(f.id)}
              className="bg-gray-800 hover:bg-gray-700 cursor-pointer"
            >
              <CardContent className="text-center">
                <FolderIcon className="mx-auto mb-2" size={32} />
                <p className="truncate">{f.name}</p>
              </CardContent>
            </Card>
          ))}

          {files.map((file: DriveFile) => (
            <Card key={file.id} className="bg-gray-800 hover:bg-gray-700">
              <CardContent className="text-center space-y-2">
                <FileIcon className="mx-auto" size={32} />
                <p className="truncate">{file.name}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    await deleteFile(file.id, file.url)
                    queryClient.invalidateQueries({ queryKey: ["files", currentFolderId ?? 0] })
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
