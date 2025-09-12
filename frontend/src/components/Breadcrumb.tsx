import { ChevronRight, Home } from "lucide-react"

export interface Crumb {
  id: number | null
  name: string
}

interface BreadcrumbProps {
  crumbs: Crumb[]
  onNavigate: (index: number) => void
}

export default function Breadcrumb({ crumbs, onNavigate }: BreadcrumbProps) {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border-b border-slate-700/30 px-6 py-3">
      <div className="flex items-center space-x-2 text-sm">
        {crumbs.map((crumb, index) => (
          <div key={index} className="flex items-center space-x-2 animate-in fade-in duration-200">
            {index === 0 && <Home className="w-4 h-4 text-slate-400" />}
            <button
              onClick={() => onNavigate(index)}
              className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              {crumb.name}
            </button>
            {index < crumbs.length - 1 && (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

