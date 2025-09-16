import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const folderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Folder name is required")
    .max(128, "Folder name must be under 128 characters"),
})

export type CreateFolderFormValues = z.infer<typeof folderSchema>

export interface CreateFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentId: number
  authToken?: string | null
  onCreated?: () => Promise<void> | void
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  parentId,
  authToken,
  onCreated,
}: CreateFolderDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFolderFormValues>({
    resolver: zodResolver(folderSchema),
    defaultValues: { name: "" },
  })

  const nameField = register("name")

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => window.clearTimeout(timer)
    }
  }, [open])

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset({ name: "" })
    }
    onOpenChange(nextOpen)
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!authToken) {
      toast.error("You must be signed in to create folders")
      return
    }

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: values.name,
          parentId: parentId === 0 ? null : parentId,
        }),
      })

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => null)) as { message?: string; error?: string } | null
        const message =
          (errorData && (errorData.message || errorData.error)) ||
          "Failed to create folder"
        throw new Error(message)
      }

      toast.success("Folder created")
      await onCreated?.()
      handleDialogChange(false)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create folder"
      toast.error(message)
    }
  })

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create new folder</DialogTitle>
            <DialogDescription>
              Organize your files by creating a new folder in this location.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder name</Label>
            <Input
              id="folder-name"
              placeholder="Enter a folder name"
              {...nameField}
              ref={(element) => {
                nameField.ref(element)
                inputRef.current = element
              }}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
