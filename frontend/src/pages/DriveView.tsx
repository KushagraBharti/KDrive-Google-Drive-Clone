"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import Navbar from "@/components/Navbar"
import FolderCard from "@/components/FolderCard"
import FileCard from "@/components/FileCard"
import UploadButton from "@/components/UploadButton"
import { useFolders } from "@/hooks/useFolders"
import { useFiles } from "@/hooks/useFiles"
import { useUpload } from "@/hooks/useUpload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  Home,
  ChevronRight,
  Cloud,
} from "lucide-react"
import { useAuth } from '@/hooks/useAuth'

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

interface Crumb {
  id: number | null
  name: string
}

export default function DriveView() {

  const { signOut } = useAuth()

  const { folderId = "root" } = useParams<{ folderId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const parentId = folderId === "root" ? null : Number(folderId)

  const folders = useFolders(parentId)
  const files = useFiles(parentId ?? 0)
  useUpload()

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([
    { id: null, name: "My Drive" },
  ])

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

  const items = [
    ...filteredFolders.map((f) => ({ ...f, type: "folder" as const })),
    ...filteredFiles.map((f) => ({ ...f, type: "file" as const })),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
            <UploadButton parentId={parentId ?? 0} />
            <Button 
              variant="default" 
              onClick={signOut} 
              className="w-28 h-9.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/60 backdrop-blur-sm border-b border-slate-700/30 px-6 py-3">
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2 animate-in fade-in duration-200">
              {index === 0 && <Home className="w-4 h-4 text-slate-400" />}
              <button
                onClick={() => navigateToBreadcrumb(index)}
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                {crumb.name}
              </button>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              )}
            </div>
          ))}
        </div>
      </div>

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
                    <CardContent className="p-4 text-center">
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
                        />
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex items-center justify-between p-3 hover:bg-slate-800/40 rounded-lg transition-all duration-200 backdrop-blur-sm border border-transparent hover:border-slate-700/30">
                    <div className="flex items-center space-x-3 flex-1">
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
                            <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20">
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
    </div>
  )
}
