"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface ShareFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string | null
}

export default function ShareFileDialog({ open, onOpenChange, url }: ShareFileDialogProps) {
  React.useEffect(() => {
    if (open && url) {
      navigator.clipboard.writeText(url).catch(() => {})
    }
  }, [open, url])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
        <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md space-y-4">
            <DialogPrimitive.Title className="text-lg font-semibold text-slate-200">
              Share Link
            </DialogPrimitive.Title>
            <Input readOnly value={url ?? ""} onFocus={(e) => e.currentTarget.select()} />
            <div className="flex justify-end">
              <Button type="button" onClick={() => url && navigator.clipboard.writeText(url)}>
                Copy Link
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

