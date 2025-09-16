import { useState } from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export type DeletableItem = {
  id: number
  name: string
  type: "file" | "folder"
}

export interface DeleteItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: DeletableItem | null
  authToken?: string | null
  onDeleted?: (item: DeletableItem) => Promise<void> | void
}

export function DeleteItemDialog({
  open,
  onOpenChange,
  item,
  authToken,
  onDeleted,
}: DeleteItemDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setIsDeleting(false)
    }
    onOpenChange(nextOpen)
  }

  const handleDelete = async () => {
    if (!item) return

    if (!authToken) {
      toast.error("You must be signed in to delete items")
      return
    }

    const endpoint =
      item.type === "folder" ? `/api/folders/${item.id}` : `/api/files/${item.id}`
    const label = item.type === "folder" ? "folder" : "file"

    setIsDeleting(true)
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => null)) as { message?: string; error?: string } | null
        const message =
          (errorData && (errorData.message || errorData.error)) ||
          `Failed to delete ${label}`
        throw new Error(message)
      }

      toast.success(`Deleted ${label}`)
      await onDeleted?.(item)
      handleDialogChange(false)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : `Failed to delete ${label}`
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {item?.type === "folder" ? "folder" : "file"}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{item?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
