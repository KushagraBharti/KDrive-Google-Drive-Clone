import prisma from '@/services/prisma';
import { supabaseAdmin } from '@/services/supabase';

export function getFiles(parentId: number, ownerId: string) {
  return prisma.file.findMany({
    where: { parentId, ownerId },
    orderBy: { id: 'asc' },
  });
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
