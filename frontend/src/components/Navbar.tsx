import { Cloud, FolderPlus, Grid3X3, List, Search } from "lucide-react"
import UploadButton from "./UploadButton"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useAuth } from "@/hooks/useAuth"

type ViewMode = "grid" | "list"

interface NavbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  viewMode: ViewMode
  onToggleView: () => void
  onCreateFolder: () => void
  currentFolderId: number
  onUploadComplete: () => void
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleView,
  onCreateFolder,
  currentFolderId,
  onUploadComplete,
}: NavbarProps) {
  const { signOut } = useAuth()

  return (
    <header className="sticky top-0 z-20 border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-white" />
            <span className="text-xl font-semibold tracking-tight text-white">KDrive</span>
          </div>
          <div className="relative w-full min-w-[16rem] max-w-xl lg:w-96">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search in Drive"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-11 w-full rounded-xl border-slate-600 bg-slate-800/70 pl-10 text-sm text-slate-100 placeholder:text-slate-400 focus:border-slate-500 focus:bg-slate-800 focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleView}
            className="h-11 w-11 rounded-full border-slate-600 bg-slate-800/70 text-slate-200 transition-colors duration-200 hover:bg-slate-700 hover:text-white"
            aria-label="Toggle view"
          >
            {viewMode === "grid" ? (
              <List className="h-5 w-5" />
            ) : (
              <Grid3X3 className="h-5 w-5" />
            )}
          </Button>
          <UploadButton
            parentId={currentFolderId}
            onUploaded={onUploadComplete}
            className="w-full min-[420px]:w-auto rounded-xl bg-slate-700/60 text-sm font-medium text-slate-100 transition-colors duration-200 hover:bg-slate-600"
          />
          <Button
            onClick={onCreateFolder}
            className="flex w-full min-[420px]:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-medium text-white shadow-lg shadow-blue-900/20 transition-colors duration-200 hover:bg-blue-500"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
          <Button
            variant="default"
            onClick={signOut}
            className="flex w-full min-[420px]:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-colors duration-200 hover:from-blue-500 hover:to-purple-500"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
