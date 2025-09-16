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

const renameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(128, "Name must be under 128 characters"),
})

export type RenameItemFormValues = z.infer<typeof renameSchema>

export type RenameableItem = {
  id: number
  name: string
  type: "file" | "folder"
}

export interface RenameItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: RenameableItem | null
  authToken?: string | null
  onRenamed?: (item: RenameableItem & { name: string }) => Promise<void> | void
}

export function RenameItemDialog({
  open,
  onOpenChange,
  item,
  authToken,
  onRenamed,
}: RenameItemDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RenameItemFormValues>({
    resolver: zodResolver(renameSchema),
    defaultValues: { name: "" },
  })

  const nameField = register("name")
  const currentValue = watch("name")
  const trimmedValue = currentValue?.trim() ?? ""
  const isUnchanged = item ? trimmedValue === item.name : true

  useEffect(() => {
    if (open && item) {
      reset({ name: item.name })
      const timer = window.setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => window.clearTimeout(timer)
    }
  }, [open, item, reset])

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset({ name: "" })
    }
    onOpenChange(nextOpen)
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!item) return

    if (!authToken) {
      toast.error("You must be signed in to rename items")
      return
    }

    const payloadName = values.name.trim()
    if (!payloadName) {
      toast.error("Name is required")
      return
    }

    if (payloadName === item.name) {
      handleDialogChange(false)
      return
    }

    const endpoint = item.type === "folder" ? `/api/folders/${item.id}` : `/api/files/${item.id}`
    const label = item.type === "folder" ? "folder" : "file"

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name: payloadName }),
      })

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => null)) as { message?: string; error?: string } | null
        const message =
          (errorData && (errorData.message || errorData.error)) ||
          `Failed to rename ${label}`
        throw new Error(message)
      }

      toast.success(`Renamed ${label}`)
      await onRenamed?.({ ...item, name: payloadName })
      handleDialogChange(false)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : `Failed to rename ${label}`
      toast.error(message)
    }
  })

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Rename {item?.type === "folder" ? "folder" : "file"}</DialogTitle>
            <DialogDescription>
              Enter a new name for {item?.type === "folder" ? "this folder" : "this file"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="rename-item">Name</Label>
            <Input
              id="rename-item"
              placeholder="Enter a new name"
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
            <Button type="submit" disabled={isSubmitting || isUnchanged}>
              {isSubmitting ? "Renaming…" : "Rename"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
