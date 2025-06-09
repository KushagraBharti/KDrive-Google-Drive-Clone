"use client"

import Navbar from "@/components/Navbar"
import FolderCard from "@/components/FolderCard"
import FileCard from "@/components/FileCard"
import UploadButton from "@/components/UploadButton"
import { useFolders } from "@/hooks/useFolders"
import { useFiles } from "@/hooks/useFiles"
import { useUpload } from "@/hooks/useUpload"
import { useParams, useNavigate } from "react-router-dom"

export default function DriveView() {
  const { folderId = "root" } = useParams<{ folderId: string }>()
  const navigate = useNavigate()

  const parentId = folderId === "root" ? null : Number(folderId)

  // Fetch folders and files for this directory
  const folders = useFolders(parentId)
  const files = useFiles(parentId ?? 0)
  useUpload() // initialize hook for side effects if any

  return (
    <div className="p-4 space-y-4">
      <Navbar />
      <div className="flex justify-end">
        <UploadButton parentId={parentId ?? 0} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {folders.map((f) => (
          <FolderCard
            key={f.id}
            name={f.name}
            onClick={() => navigate(`/drive/${f.id}`)}
          />
        ))}
        {files.map((f) => (
          <FileCard key={f.id} name={f.name} />
        ))}
      </div>
    </div>
  )
}
