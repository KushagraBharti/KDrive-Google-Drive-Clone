import { useEffect, useMemo, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { supabaseClient } from "@/contexts/SupabaseContext"
import { Loader2, FileWarning } from "lucide-react"
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf"
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api"
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url"

GlobalWorkerOptions.workerSrc = pdfWorkerSrc

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "svg",
  "webp",
])

const TEXT_EXTENSIONS = new Set([
  "txt",
  "md",
  "json",
  "js",
  "ts",
  "tsx",
  "jsx",
  "html",
  "css",
  "csv",
  "log",
])

type PreviewType = "none" | "image" | "text" | "pdf" | "unsupported"

type PreviewFile = {
  name: string
  path?: string | null
  size?: number | null
}

export interface PreviewDialogProps {
  file: PreviewFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getPreviewType(fileName?: string | null): PreviewType {
  if (!fileName) {
    return "none"
  }
  const ext = fileName.split(".").pop()?.toLowerCase()
  if (!ext) {
    return "unsupported"
  }
  if (IMAGE_EXTENSIONS.has(ext)) {
    return "image"
  }
  if (TEXT_EXTENSIONS.has(ext)) {
    return "text"
  }
  if (ext === "pdf") {
    return "pdf"
  }
  return "unsupported"
}

function formatBytes(bytes?: number | null) {
  if (!bytes) return null
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function PreviewDialog({ file, open, onOpenChange }: PreviewDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [textContent, setTextContent] = useState("")
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)

  const previewType = useMemo(() => getPreviewType(file?.name ?? null), [file?.name])

  useEffect(() => {
    if (!open) {
      setIsLoading(false)
      setError(null)
      setTextContent("")
      setImageUrl(null)
      if (canvasContainerRef.current) {
        canvasContainerRef.current.innerHTML = ""
      }
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  useEffect(() => {
    if (!open || !file) {
      return
    }

    setError(null)
    setTextContent("")
    setImageUrl(null)
    if (canvasContainerRef.current) {
      canvasContainerRef.current.innerHTML = ""
    }

    if (previewType === "none") {
      return
    }

    if (previewType === "unsupported") {
      setError("This file type cannot be previewed yet.")
      setIsLoading(false)
      return
    }

    const path = file.path

    if (!path) {
      setError("This file is missing a storage path.")
      setIsLoading(false)
      return
    }

    let cancelled = false

    const loadFile = async () => {
      setIsLoading(true)
      try {
        const { data, error: downloadError } = await supabaseClient.storage
          .from("files")
          .download(path)

        if (downloadError || !data) {
          throw downloadError ?? new Error("Missing file data")
        }

        if (cancelled) {
          return
        }

        if (previewType === "image") {
          const url = URL.createObjectURL(data)
          if (!cancelled) {
            setImageUrl(url)
          }
          return
        }

        if (previewType === "text") {
          const text = await data.text()
          if (!cancelled) {
            setTextContent(text)
          }
          return
        }

        if (previewType === "pdf") {
          const buffer = await data.arrayBuffer()
          if (cancelled) {
            return
          }

          const pdf: PDFDocumentProxy = await getDocument({ data: buffer }).promise
          if (cancelled) {
            return
          }

          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
            if (cancelled) {
              break
            }
            const page = await pdf.getPage(pageNumber)
            const viewport = page.getViewport({ scale: 1.2 })
            const canvas = document.createElement("canvas")
            const context = canvas.getContext("2d")
            if (!context) {
              continue
            }
            canvas.height = viewport.height
            canvas.width = viewport.width
            canvas.className =
              "mb-4 w-full max-w-full overflow-hidden rounded border border-border bg-white shadow-sm"
            await page.render({ canvasContext: context, viewport }).promise
            if (!cancelled) {
              canvasContainerRef.current?.appendChild(canvas)
            }
          }
        }
      } catch (err) {
        console.error("Failed to load preview", err)
        if (!cancelled) {
          setError("We couldn't load a preview for this file.")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadFile()

    return () => {
      cancelled = true
    }
  }, [file, open, previewType])

  const formattedSize = formatBytes(file?.size ?? null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[min(90vw,900px)] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="truncate">{file?.name ?? "Preview"}</DialogTitle>
          <DialogDescription>
            {formattedSize ? `File size: ${formattedSize}` : "Preview the selected file."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex-1 overflow-hidden">
          <div className="max-h-[70vh] overflow-auto rounded-lg border border-border/60 bg-muted/40 p-4">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : error ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
                <FileWarning className="h-10 w-10" />
                <p>{error}</p>
              </div>
            ) : previewType === "image" && imageUrl ? (
              <img
                src={imageUrl}
                alt={file?.name ?? "Selected file"}
                className="mx-auto max-h-[65vh] w-full rounded-md object-contain"
              />
            ) : previewType === "text" ? (
              <pre className="max-h-[65vh] whitespace-pre-wrap break-words rounded-md bg-background/80 p-4 font-mono text-sm text-foreground">
                {textContent}
              </pre>
            ) : previewType === "pdf" ? (
              <div ref={canvasContainerRef} className="flex flex-col items-center" />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
                <FileWarning className="h-10 w-10" />
                <p>Select a supported file type to preview.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PreviewDialog
