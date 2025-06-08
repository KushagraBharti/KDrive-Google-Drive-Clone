"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import {
  Folder,
  File,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  Upload,
  Search,
  Grid3X3,
  List,
  MoreVertical,
  Home,
  ChevronRight,
  Plus,
} from "lucide-react"

// Mock data structure (keeping the same data)
const mockData = {
  "/": {
    name: "My Drive",
    items: [
      { id: "1", name: "Documents", type: "folder", path: "/Documents" },
      { id: "2", name: "Photos", type: "folder", path: "/Photos" },
      { id: "3", name: "Projects", type: "folder", path: "/Projects" },
      { id: "4", name: "Resume.pdf", type: "file", size: "245 KB", modified: "Oct 15, 2024" },
      { id: "5", name: "Presentation.pptx", type: "file", size: "2.1 MB", modified: "Oct 12, 2024" },
      { id: "6", name: "Budget.xlsx", type: "file", size: "89 KB", modified: "Oct 10, 2024" },
    ],
  },
  "/Documents": {
    name: "Documents",
    items: [
      { id: "7", name: "Work", type: "folder", path: "/Documents/Work" },
      { id: "8", name: "Personal", type: "folder", path: "/Documents/Personal" },
      { id: "9", name: "Report.docx", type: "file", size: "156 KB", modified: "Oct 14, 2024" },
      { id: "10", name: "Notes.txt", type: "file", size: "12 KB", modified: "Oct 13, 2024" },
    ],
  },
  "/Documents/Work": {
    name: "Work",
    items: [
      { id: "11", name: "Meeting Notes.docx", type: "file", size: "78 KB", modified: "Oct 16, 2024" },
      { id: "12", name: "Project Plan.pdf", type: "file", size: "234 KB", modified: "Oct 15, 2024" },
      { id: "13", name: "Contracts", type: "folder", path: "/Documents/Work/Contracts" },
    ],
  },
  "/Documents/Work/Contracts": {
    name: "Contracts",
    items: [
      { id: "14", name: "Client Agreement.pdf", type: "file", size: "445 KB", modified: "Oct 8, 2024" },
      { id: "15", name: "NDA.pdf", type: "file", size: "123 KB", modified: "Oct 5, 2024" },
    ],
  },
  "/Documents/Personal": {
    name: "Personal",
    items: [
      { id: "16", name: "Travel Plans.docx", type: "file", size: "67 KB", modified: "Oct 11, 2024" },
      { id: "17", name: "Shopping List.txt", type: "file", size: "3 KB", modified: "Oct 9, 2024" },
    ],
  },
  "/Photos": {
    name: "Photos",
    items: [
      { id: "18", name: "Vacation 2024", type: "folder", path: "/Photos/Vacation 2024" },
      { id: "19", name: "Family", type: "folder", path: "/Photos/Family" },
      { id: "20", name: "sunset.jpg", type: "file", size: "2.3 MB", modified: "Oct 7, 2024" },
      { id: "21", name: "portrait.png", type: "file", size: "1.8 MB", modified: "Oct 6, 2024" },
    ],
  },
  "/Photos/Vacation 2024": {
    name: "Vacation 2024",
    items: [
      { id: "22", name: "beach.jpg", type: "file", size: "3.1 MB", modified: "Sep 20, 2024" },
      { id: "23", name: "mountains.jpg", type: "file", size: "2.8 MB", modified: "Sep 19, 2024" },
      { id: "24", name: "city.jpg", type: "file", size: "2.5 MB", modified: "Sep 18, 2024" },
    ],
  },
  "/Photos/Family": {
    name: "Family",
    items: [
      { id: "25", name: "birthday.jpg", type: "file", size: "1.9 MB", modified: "Aug 15, 2024" },
      { id: "26", name: "reunion.jpg", type: "file", size: "2.2 MB", modified: "Aug 10, 2024" },
    ],
  },
  "/Projects": {
    name: "Projects",
    items: [
      { id: "27", name: "Website Redesign", type: "folder", path: "/Projects/Website Redesign" },
      { id: "28", name: "Mobile App", type: "folder", path: "/Projects/Mobile App" },
      { id: "29", name: "project-archive.zip", type: "file", size: "15.2 MB", modified: "Oct 1, 2024" },
    ],
  },
  "/Projects/Website Redesign": {
    name: "Website Redesign",
    items: [
      { id: "30", name: "wireframes.pdf", type: "file", size: "890 KB", modified: "Oct 3, 2024" },
      { id: "31", name: "mockups.psd", type: "file", size: "12.5 MB", modified: "Oct 2, 2024" },
    ],
  },
  "/Projects/Mobile App": {
    name: "Mobile App",
    items: [
      { id: "32", name: "app-demo.mp4", type: "file", size: "45.2 MB", modified: "Sep 28, 2024" },
      { id: "33", name: "requirements.docx", type: "file", size: "234 KB", modified: "Sep 25, 2024" },
    ],
  },
}

function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
      return <FileText className="w-8 h-8 text-blue-400 transition-colors duration-200" />
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "psd":
      return <ImageIcon className="w-8 h-8 text-emerald-400 transition-colors duration-200" />
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
      return <Video className="w-8 h-8 text-purple-400 transition-colors duration-200" />
    case "mp3":
    case "wav":
    case "flac":
      return <Music className="w-8 h-8 text-orange-400 transition-colors duration-200" />
    case "zip":
    case "rar":
    case "7z":
      return <Archive className="w-8 h-8 text-yellow-400 transition-colors duration-200" />
    case "xlsx":
    case "xls":
    case "pptx":
    case "ppt":
      return <FileText className="w-8 h-8 text-red-400 transition-colors duration-200" />
    default:
      return <File className="w-8 h-8 text-gray-400 transition-colors duration-200" />
  }
}

export default function Component() {
  const [currentPath, setCurrentPath] = useState("/")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const currentFolder = mockData[currentPath as keyof typeof mockData]

  const filteredItems =
    currentFolder?.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())) || []

  const breadcrumbs = currentPath === "/" ? ["My Drive"] : ["My Drive", ...currentPath.split("/").filter(Boolean)]

  const navigateToFolder = (path: string) => {
    setCurrentPath(path)
  }

  const navigateToBreadcrumb = (index: number) => {
    if (index === 0) {
      setCurrentPath("/")
    } else {
      const pathParts = currentPath.split("/").filter(Boolean)
      const newPath = "/" + pathParts.slice(0, index).join("/")
      setCurrentPath(newPath)
    }
  }

  const handleUpload = () => {
    alert("Upload functionality would be implemented here!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">Drive</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
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
              className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-200"
            >
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>New</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleUpload}
              className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              <span>Upload</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-slate-800/60 backdrop-blur-sm border-b border-slate-700/30 px-6 py-3">
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2 animate-in fade-in duration-200">
              {index === 0 && <Home className="w-4 h-4 text-slate-400" />}
              <button
                onClick={() => navigateToBreadcrumb(index)}
                className="text-slate-300 hover:text-blue-400 hover:underline transition-colors duration-200 font-medium"
              >
                {crumb}
              </button>
              {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 text-slate-500" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <Folder className="w-16 h-16 text-slate-600 mx-auto mb-4" />
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
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {viewMode === "grid" ? (
                  <Card className="bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/60 hover:border-slate-600 hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300 transform hover:scale-105 cursor-pointer backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      {item.type === "folder" ? (
                        <div onClick={() => navigateToFolder(item.path!)} className="group">
                          <Folder className="w-12 h-12 text-blue-400 mx-auto mb-2 group-hover:text-blue-300 transition-colors duration-200" />
                          <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors duration-200">
                            {item.name}
                          </p>
                        </div>
                      ) : (
                        <a
                          href="#"
                          className="block group hover:bg-slate-700/30 rounded-lg p-2 -m-2 transition-colors duration-200"
                        >
                          <div className="mb-2 flex justify-center group-hover:scale-110 transition-transform duration-200">
                            {getFileIcon(item.name)}
                          </div>
                          <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors duration-200">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
                            {item.size}
                          </p>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex items-center justify-between p-3 hover:bg-slate-800/40 rounded-lg transition-all duration-200 backdrop-blur-sm border border-transparent hover:border-slate-700/30">
                    <div className="flex items-center space-x-3 flex-1">
                      {item.type === "folder" ? (
                        <button
                          onClick={() => navigateToFolder(item.path!)}
                          className="flex items-center space-x-3 flex-1 group"
                        >
                          <Folder className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
                          <span className="font-medium text-slate-200 group-hover:text-white transition-colors duration-200">
                            {item.name}
                          </span>
                        </button>
                      ) : (
                        <a href="#" className="flex items-center space-x-3 flex-1 group">
                          <div className="group-hover:scale-110 transition-transform duration-200">
                            {getFileIcon(item.name)}
                          </div>
                          <span className="font-medium text-slate-200 group-hover:text-white transition-colors duration-200">
                            {item.name}
                          </span>
                        </a>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      {item.type === "file" && (
                        <>
                          <span className="hover:text-slate-300 transition-colors duration-200">{item.modified}</span>
                          <span className="hover:text-slate-300 transition-colors duration-200">{item.size}</span>
                        </>
                      )}
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
                          <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">Open</DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">Share</DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">Rename</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
