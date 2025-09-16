import type { FC } from "react"

export interface SkeletonCardProps {
  view?: "grid" | "list"
}

const SkeletonCard: FC<SkeletonCardProps> = ({ view = "grid" }) => {
  if (view === "list") {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-700/40 bg-slate-800/50 p-4 shadow-sm shadow-slate-900/20 backdrop-blur-sm">
        <div className="flex animate-pulse flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-start gap-3 sm:items-center">
            <div className="h-10 w-10 rounded-xl bg-slate-700/70 sm:h-12 sm:w-12" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-3 w-1/2 rounded-full bg-slate-700/70" />
              <div className="h-3 w-1/3 rounded-full bg-slate-800/80" />
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end">
            <div className="h-3 w-20 rounded-full bg-slate-800/70" />
            <div className="h-3 w-16 rounded-full bg-slate-800/70" />
            <div className="h-9 w-9 rounded-full bg-slate-800/70" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group h-full animate-pulse">
      <div className="h-full overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-lg shadow-slate-900/20">
        <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-6 text-center sm:px-6">
          <div className="h-12 w-12 rounded-2xl bg-slate-700/70" />
          <div className="h-3 w-3/4 rounded-full bg-slate-700/70" />
          <div className="h-3 w-1/2 rounded-full bg-slate-800/80" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonCard
