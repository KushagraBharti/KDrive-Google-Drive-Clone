import prisma from '@/services/prisma';
import { supabaseAdmin } from '@/services/supabase';

export async function getFiles(parentId: number, ownerId: string) {
  const files = await prisma.file.findMany({
    where: { parentId, ownerId },
    orderBy: { id: 'asc' },
  });

  const filesWithUrls = await Promise.all(
    files.map(async (file) => {
      const { data, error } = await supabaseAdmin.storage
        .from('files')
        .createSignedUrl(file.path, 60);

      if (error) {
        return file;
      }

      return {
        ...file,
        url: data.signedUrl,
      };
    })
  );

  return filesWithUrls;
}

export async function createFile(args: {
  name: string;
  size: number;
  path: string;
  parentId: number;
  ownerId: string;
}) {
  // Generate a short-lived signed URL for initial persistence.
  // Listing re-generates fresh signed URLs, so this value is not relied on long-term.
  const { data: signed, error } = await supabaseAdmin
    .storage
    .from('files')
    .createSignedUrl(args.path, 60);

  if (error || !signed?.signedUrl) {
    throw new Error('Failed to create signed URL for file');
  }

  return prisma.file.create({ data: { ...args, url: signed.signedUrl } });
}

export async function deleteFile(id: number, ownerId: string) {
  const file = await prisma.file.delete({
    where: { id, ownerId },
  });
  await supabaseAdmin.storage.from('files').remove([file.path]);
  return file;
}

export function renameFile(id: number, ownerId: string, name: string) {
  return prisma.file.update({
    where: { id, ownerId },
    data: { name },
  });
}
