import { useState, useEffect } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { File as PrismaFile } from "@prisma/client"

export interface RenameFileDialogProps {
  file: PrismaFile | null
  token?: string
  onClose: () => void
  onRenamed: () => void
}

export default function RenameFileDialog({ file, token, onClose, onRenamed }: RenameFileDialogProps) {
  const [name, setName] = useState("")

  useEffect(() => {
    setName(file?.name ?? "")
  }, [file])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !token || !name || name === file.name) {
      onClose()
      return
    }

    await fetch(`/api/files/${file.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
    onRenamed()
    onClose()
  }

  return (
    <Dialog.Root open={!!file} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 p-6 rounded-lg shadow-xl w-80 text-white">
          <Dialog.Title className="text-lg font-semibold mb-4">Rename File</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

