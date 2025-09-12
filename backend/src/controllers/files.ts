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

export function createFile(args: {
  name: string;
  size: number;
  url: string;
  path: string;
  parentId: number;
  ownerId: string;
}) {
  return prisma.file.create({ data: args });
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
