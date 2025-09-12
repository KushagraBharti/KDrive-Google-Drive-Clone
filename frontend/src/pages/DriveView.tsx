"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import FolderCard from "@/components/FolderCard"
import FileCard from "@/components/FileCard"
import UploadButton from "@/components/UploadButton"
import Breadcrumb, { Crumb } from "@/components/Breadcrumb"
import RenameFolderDialog from "@/components/RenameFolderDialog"
import ConfirmFolderDeleteDialog from "@/components/ConfirmFolderDeleteDialog"
import NewFolderDialog from "@/components/NewFolderDialog"
import { useFolders } from "@/hooks/useFolders"
import { useFiles } from "@/hooks/useFiles"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import RenameFileDialog from "@/components/RenameFileDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Folder as FolderIcon,
  Search,
  Grid3X3,
  List,
  MoreVertical,
  Cloud,
  FolderPlus,
} from "lucide-react"
import type { Folder, File as PrismaFile } from '@prisma/client'
import { useAuth } from '@/hooks/useAuth'
import { supabaseClient } from '@/contexts/SupabaseContext'
import ShareFileDialog from "@/components/ShareFileDialog"

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function DriveView() {

  const { signOut, session } = useAuth()

  const { folderId = "root" } = useParams<{ folderId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const currentFolderId = folderId === "root" ? 0 : Number(folderId)

  const {
    folders,
    refetch: refetchFolders,
    renameFolder,
    deleteFolder,
    isLoading: foldersLoading,
    error: foldersErrorObj
  } = useFolders(currentFolderId === 0 ? null : currentFolderId)

  const {
    files,
    refetch,
    isLoading: filesLoading,
    error: filesErrorObj
  } = useFiles(currentFolderId)

  const isLoading = foldersLoading || filesLoading
  const error = foldersErrorObj || filesErrorObj

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [newFolderOpen, setNewFolderOpen] = useState(false)
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([
    { id: null, name: "My Drive" },
  ])
  const [shareOpen, setShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [fileToRename, setFileToRename] = useState<PrismaFile | null>(null)


  useEffect(() => {
    const crumbs = (location.state as any)?.breadcrumbs as Crumb[] | undefined
    setBreadcrumbs(crumbs ?? [{ id: null, name: "My Drive" }])
  }, [folderId, location.state])

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openFolder = (id: number, name: string) => {
    const newCrumbs = [...breadcrumbs, { id, name }]
    navigate(`/drive/${id}`, { state: { breadcrumbs: newCrumbs } })
  }

  const navigateToBreadcrumb = (index: number) => {
    const crumb = breadcrumbs[index]
    const newCrumbs = breadcrumbs.slice(0, index + 1)
    navigate(crumb.id === null ? "/drive/root" : `/drive/${crumb.id}`, {
      state: { breadcrumbs: newCrumbs },
    })
  }

  const [folderToRename, setFolderToRename] = useState<Folder | null>(null)
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null)

  const token = session?.access_token

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error loading drive
      </div>
    )
  }

  const handleCreateFolder = async (name: string) => {
    if (!token || !name) return
    await fetch('/api/folders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        parentId: currentFolderId === 0 ? null : currentFolderId,
      }),
    })
    refetchFolders()
    setNewFolderOpen(false)
  }

  const handleDelete = async (id: number) => {
    if (!token) return
    await fetch(`/api/files/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    refetch()
  }

  const handleDownload = async (file: PrismaFile) => {
    const { data } = await supabaseClient.storage.from('files').download(file.path)
    if (data) {
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleRenameClick = (file: PrismaFile) => {
    setFileToRename(file)
  }

  const handleShare = async (file: PrismaFile) => {
    if (!token) return
    const res = await fetch(`/api/files/${file.id}/share`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setShareUrl(data.url)
      setShareOpen(true)
      navigator.clipboard.writeText(data.url).catch(() => {})
    }
  }

  type FolderItem = Folder & { type: 'folder' }
  type FileItem = PrismaFile & { type: 'file' }
  type Item = FolderItem | FileItem

  const items: Item[] = [
    ...filteredFolders.map((f): FolderItem => ({ ...f, type: 'folder' })),
    ...filteredFiles.map((f): FileItem => ({ ...f, type: 'file' })),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NewFolderDialog
        open={newFolderOpen}
        onOpenChange={setNewFolderOpen}
        onCreate={handleCreateFolder}
      />
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-white" />
              <span className="text-lg font-bold text-white">KDrive</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search in Drive"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-96 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:bg-slate-700 focus:border-slate-500 transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="w-16 h-10 p-0 bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-200 flex items-center justify-center"
            >
              {viewMode === "grid" ? (
                <List className="w-8 h-8" />
              ) : (
                <Grid3X3 className="w-8 h-8" />
              )}
            </Button>
            <UploadButton parentId={currentFolderId} onUploaded={refetch} />
            <Button onClick={() => setNewFolderOpen(true)}>
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
            <Button 
              variant="default" 
              onClick={signOut} 
              className="w-28 h-9.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <Breadcrumb crumbs={breadcrumbs} onNavigate={navigateToBreadcrumb} />

      <div className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <FolderIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              {searchQuery ? "No items match your search" : "This folder is empty"}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
                : "space-y-1"
            }
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {viewMode === "grid" ? (
                  <Card className="bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/60 hover:border-slate-600 hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300 transform hover:scale-105 cursor-pointer backdrop-blur-sm">
                    <CardContent className="p-4 text-center relative">
                      {item.type === "folder" ? (
                        <FolderCard
                          folder={item}
                          view="grid"
                          onClick={() => openFolder(item.id, item.name)}
                        />
                      ) : (
                        <FileCard
                          file={item}
                          view="grid"
                          size={formatBytes(item.size)}
                          modified={new Date(item.createdAt).toLocaleDateString()}
                        />
                      )}
                      {item.type === "folder" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 w-8 h-8 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-slate-200">
                            <DropdownMenuItem
                              className="hover:bg-slate-700 focus:bg-slate-700"
                              onClick={() => setFolderToRename(item)}
                            >
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20"
                              onClick={() => setFolderToDelete(item)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex items-center justify-between p-3 hover:bg-slate-800/40 rounded-lg transition-all duration-200 backdrop-blur-sm border border-transparent hover:border-slate-700/30">
                    <div className="flex items-center space-x-3 flex-1">
                      {item.type === "folder" ? (
                        <FolderCard
                          folder={item}
                          view="list"
                          onClick={() => openFolder(item.id, item.name)}
                        />
                      ) : (
                        <FileCard
                          file={item}
                          view="list"
                          size={formatBytes(item.size)}
                          modified={new Date(item.createdAt).toLocaleDateString()}
                        />
                      )}
                    </div>
                    {item.type === "file" && (
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span className="hover:text-slate-300 transition-colors duration-200">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span className="hover:text-slate-300 transition-colors duration-200">
                          {formatBytes(item.size)}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-slate-200">
                            <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-slate-700 focus:bg-slate-700"
                              onClick={() => handleShare(item)}
                            >
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700" onClick={() => handleDownload(item)}>
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700" onClick={() => handleRenameClick(item)}>
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20" onClick={() => handleDelete(item.id)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                    {item.type === "folder" && (
                      <div className="flex items-center text-sm text-slate-400">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-slate-200">
                            <DropdownMenuItem
                              className="hover:bg-slate-700 focus:bg-slate-700"
                              onClick={() => setFolderToRename(item)}
                            >
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20"
                              onClick={() => setFolderToDelete(item)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <ShareFileDialog open={shareOpen} onOpenChange={setShareOpen} url={shareUrl} />
      <RenameFileDialog
        file={fileToRename}
        token={token}
        onClose={() => setFileToRename(null)}
        onRenamed={refetch}
      />
      <RenameFolderDialog
        open={!!folderToRename}
        folderId={folderToRename?.id ?? 0}
        currentName={folderToRename?.name ?? ''}
        onOpenChange={(open) => {
          if (!open) setFolderToRename(null)
        }}
        onRename={async (id, name) => {
          await renameFolder(id, name)
        }}
      />
      <ConfirmFolderDeleteDialog
        open={!!folderToDelete}
        folderId={folderToDelete?.id ?? 0}
        folderName={folderToDelete?.name}
        onOpenChange={(open) => {
          if (!open) setFolderToDelete(null)
        }}
        onDelete={async (id) => {
          await deleteFolder(id)
        }}
      />
    </div>
  )
}
