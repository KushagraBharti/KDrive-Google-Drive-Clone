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
    <div className="border-b border-border/40 bg-muted/60 px-6 py-3 backdrop-blur-sm">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        {crumbs.map((crumb, index) => (
          <div key={index} className="flex items-center space-x-2 animate-in fade-in duration-200">
            {index === 0 && <Home className="h-4 w-4" />}
            <button
              onClick={() => onNavigate(index)}
              className="font-medium text-foreground transition-colors duration-200 hover:text-primary"
            >
              {crumb.name}
            </button>
            {index < crumbs.length - 1 && <ChevronRight className="h-4 w-4" />}
          </div>
        ))}
      </div>
    </div>
  )
}

