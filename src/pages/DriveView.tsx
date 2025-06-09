// src/pages/DriveView.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Folder as FolderIcon,
  File as FileIcon,
} from "lucide-react"
import { useFolders, useFiles, Folder, File } from "@/hooks/useDrive"

interface Breadcrumb {
  id: number | null
  label: string
}

export default function DriveView() {
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
      <nav className="p-4 bg-gray-800 flex space-x-2 text-sm">
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
      </nav>

      <main className="p-6">
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

          {files.map((file: File) => (
            <Card key={file.id} className="bg-gray-800 hover:bg-gray-700">
              <CardContent className="text-center">
                <FileIcon className="mx-auto mb-2" size={32} />
                <p className="truncate">{file.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
