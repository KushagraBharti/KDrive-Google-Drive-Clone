import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface RenameFolderDialogProps {
  open: boolean
  folderId: number
  currentName: string
  onOpenChange: (open: boolean) => void
  onRename: (id: number, name: string) => Promise<unknown>
}

export default function RenameFolderDialog({
  open,
  folderId,
  currentName,
  onOpenChange,
  onRename,
}: RenameFolderDialogProps) {
  const [name, setName] = useState(currentName)

  useEffect(() => {
    if (open) setName(currentName)
  }, [open, currentName])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-800 p-6 text-slate-200 shadow-lg">
          <Dialog.Title className="text-lg font-medium mb-4">Rename folder</Dialog.Title>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="mb-4" />
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Dialog.Close>
            <Button
              onClick={async () => {
                await onRename(folderId, name)
                onOpenChange(false)
              }}
            >
              Rename
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

