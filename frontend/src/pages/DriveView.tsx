"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import FolderCard from "@/components/FolderCard"
import FileCard from "@/components/FileCard"
import SkeletonCard from "@/components/SkeletonCard"
import Breadcrumb, { Crumb } from "@/components/Breadcrumb"
import Navbar from "@/components/Navbar"
import { useFolders } from "@/hooks/useFolders"
import { useFiles } from "@/hooks/useFiles"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Folder as FolderIcon, MoreVertical } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabaseClient } from "@/contexts/SupabaseContext"
import { CreateFolderDialog } from "@/components/CreateFolderDialog"
import { RenameItemDialog } from "@/components/RenameItemDialog"
import type { RenameableItem } from "@/components/RenameItemDialog"
import { DeleteItemDialog } from "@/components/DeleteItemDialog"
import { PreviewDialog, type PreviewDialogProps } from "@/components/PreviewDialog"

type DriveItem = RenameableItem

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function DriveView() {
  const { session } = useAuth()

  const { folderId = "root" } = useParams<{ folderId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const currentFolderId = folderId === "root" ? 0 : Number(folderId)

  const {
    folders,
    isLoading: foldersLoading,
    refetch: refetchFolders,
  } = useFolders(
    currentFolderId === 0 ? null : currentFolderId,
  )
  const {
    files,
    isLoading: filesLoading,
    refetch: refetchFiles,
  } = useFiles(currentFolderId)

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([
    { id: null, name: "My Drive" },
  ])
  const [isContentVisible, setIsContentVisible] = useState(false)
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [itemToRename, setItemToRename] = useState<DriveItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<DriveItem | null>(null)
  const [previewFile, setPreviewFile] = useState<PreviewDialogProps["file"]>(null)

  const isLoading = foldersLoading || filesLoading

  useEffect(() => {
    const crumbs = (location.state as any)?.breadcrumbs as Crumb[] | undefined
    setBreadcrumbs(crumbs ?? [{ id: null, name: "My Drive" }])
  }, [folderId, location.state])

  useEffect(() => {
    if (isLoading) {
      setIsContentVisible(false)
      return
    }

    const timeout = window.setTimeout(() => setIsContentVisible(true), 50)
    return () => window.clearTimeout(timeout)
  }, [isLoading])

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const token = session?.access_token

  const handleCreateFolder = () => setIsCreateFolderOpen(true)

  const handleItemMutationRefresh = async (item: DriveItem) => {
    if (item.type === "folder") {
      await refetchFolders()
    } else {
      await refetchFiles()
    }
  }

  const openRenameDialog = (item: DriveItem) => setItemToRename(item)
  const openDeleteDialog = (item: DriveItem) => setItemToDelete(item)

  const handleDownload = async (file: any) => {
    const { data } = await supabaseClient.storage.from("files").download(file.path)
    if (data) {
      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const items = [
    ...filteredFolders.map((f) => ({ ...f, type: "folder" as const })),
    ...filteredFiles.map((f) => ({ ...f, type: "file" as const })),
  ]

  const toggleViewMode = () => setViewMode((mode) => (mode === "grid" ? "list" : "grid"))
  const layoutClass =
    viewMode === "grid"
      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
      : "flex flex-col gap-3"
  const skeletonCount = viewMode === "grid" ? 8 : 5

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-muted/30 to-background text-foreground">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onToggleView={toggleViewMode}
        onCreateFolder={handleCreateFolder}
        currentFolderId={currentFolderId}
        onUploadComplete={refetchFiles}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Breadcrumb crumbs={breadcrumbs} onNavigate={navigateToBreadcrumb} />

          {isLoading ? (
            <div className={layoutClass}>
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <SkeletonCard key={index} view={viewMode} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/40 px-4 py-12 text-center shadow-inner shadow-foreground/10">
              <FolderIcon className="mb-4 h-16 w-16 text-muted-foreground" />
              <p className="text-base text-muted-foreground sm:text-lg">
                {searchQuery ? "No items match your search" : "This folder is empty"}
              </p>
            </div>
          ) : (
            <div
              className={`${layoutClass} transition-opacity duration-500 ${
                isContentVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {viewMode === "grid" ? (
                    <Card className="group h-full overflow-hidden border border-border/60 bg-muted/60 shadow-lg shadow-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-muted/80">
                      <CardContent className="relative flex h-full flex-col items-center justify-center gap-4 px-4 py-6 text-center sm:px-6">
                        {item.type === "folder" ? (
                          <FolderCard
                            name={item.name}
                            view="grid"
                            onClick={() => openFolder(item.id, item.name)}
                          />
                        ) : (
                          <FileCard
                            name={item.name}
                            view="grid"
                            size={formatBytes(item.size)}
                            modified={new Date(item.createdAt).toLocaleDateString()}
                            onClick={() => setPreviewFile(item)}
                          />
                        )}
                        {item.type === "folder" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-3 top-3 h-9 w-9 rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl border border-border/60 bg-popover text-foreground backdrop-blur">
                              <DropdownMenuItem
                                className="hover:bg-muted focus:bg-muted"
                                onClick={() =>
                                  openRenameDialog({
                                    id: item.id,
                                    name: item.name,
                                    type: "folder",
                                  })
                                }
                              >
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                                onClick={() =>
                                  openDeleteDialog({
                                    id: item.id,
                                    name: item.name,
                                    type: "folder",
                                  })
                                }
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-muted/60 p-4 shadow-sm shadow-foreground/10 backdrop-blur-sm transition-colors duration-200 hover:border-border hover:bg-muted/80 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-1 items-start gap-3 sm:items-center">
                        {item.type === "folder" ? (
                          <FolderCard
                            name={item.name}
                            view="list"
                            onClick={() => openFolder(item.id, item.name)}
                          />
                        ) : (
                          <FileCard
                            name={item.name}
                            view="list"
                            size={formatBytes(item.size)}
                            modified={new Date(item.createdAt).toLocaleDateString()}
                            onClick={() => setPreviewFile(item)}
                          />
                        )}
                      </div>
                      {item.type === "file" && (
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground sm:justify-end">
                          <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground sm:bg-transparent sm:px-0 sm:py-0">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground sm:bg-transparent sm:px-0 sm:py-0">
                            {formatBytes(item.size)}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 rounded-xl border border-border/60 bg-popover text-foreground backdrop-blur">
                              <DropdownMenuItem className="hover:bg-muted focus:bg-muted">
                                Open
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-muted focus:bg-muted"
                                onClick={() => setPreviewFile(item)}
                              >
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-muted focus:bg-muted">
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-muted focus:bg-muted"
                                onClick={() => handleDownload(item)}
                              >
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-muted focus:bg-muted"
                                onClick={() =>
                                  openRenameDialog({
                                    id: item.id,
                                    name: item.name,
                                    type: "file",
                                  })
                                }
                              >
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                                onClick={() =>
                                  openDeleteDialog({
                                    id: item.id,
                                    name: item.name,
                                    type: "file",
                                  })
                                }
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                      {item.type === "folder" && (
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground sm:justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl border border-border/60 bg-popover text-foreground backdrop-blur">
                              <DropdownMenuItem
                                className="hover:bg-muted focus:bg-muted"
                                onClick={() =>
                                  openRenameDialog({
                                    id: item.id,
                                    name: item.name,
                                    type: "folder",
                                  })
                                }
                              >
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                                onClick={() =>
                                  openDeleteDialog({
                                    id: item.id,
                                    name: item.name,
                                    type: "folder",
                                  })
                                }
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
      </main>

      <CreateFolderDialog
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        parentId={currentFolderId}
        authToken={token}
        onCreated={refetchFolders}
      />
      <RenameItemDialog
        open={Boolean(itemToRename)}
        onOpenChange={(open) => {
          if (!open) setItemToRename(null)
        }}
        item={itemToRename}
        authToken={token}
        onRenamed={handleItemMutationRefresh}
      />
      <DeleteItemDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => {
          if (!open) setItemToDelete(null)
        }}
        item={itemToDelete}
        authToken={token}
        onDeleted={handleItemMutationRefresh}
      />
      <PreviewDialog
        open={Boolean(previewFile)}
        onOpenChange={(open) => {
          if (!open) setPreviewFile(null)
        }}
        file={previewFile}
      />
    </div>
  )
}
