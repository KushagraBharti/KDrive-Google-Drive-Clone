import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Button } from '@/components/ui/button'

interface ConfirmFolderDeleteDialogProps {
  open: boolean
  folderId: number
  folderName?: string
  onOpenChange: (open: boolean) => void
  onDelete: (id: number) => Promise<unknown>
}

export default function ConfirmFolderDeleteDialog({
  open,
  folderId,
  folderName,
  onOpenChange,
  onDelete,
}: ConfirmFolderDeleteDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-800 p-6 text-slate-200 shadow-lg">
          <AlertDialog.Title className="text-lg font-medium mb-2">Delete folder</AlertDialog.Title>
          <AlertDialog.Description className="mb-4 text-sm text-slate-400">
            Are you sure you want to delete {folderName ? `"${folderName}"` : 'this folder'}?
          </AlertDialog.Description>
          <div className="flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="ghost">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                variant="destructive"
                onClick={async () => {
                  await onDelete(folderId)
                  onOpenChange(false)
                }}
              >
                Delete
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

