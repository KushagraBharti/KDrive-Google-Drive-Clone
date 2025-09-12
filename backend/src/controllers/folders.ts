import prisma from '@/services/prisma';

export function getFolders(parentId: number | null, ownerId: string) {
  return prisma.folder.findMany({
    where: { parentId, ownerId },
    orderBy: { id: 'asc' },
  });
}

export function createFolder(args: {
  name: string;
  parentId: number | null;
  ownerId: string;
}) {
  return prisma.folder.create({ data: args });
}

export async function deleteFolder(id: number, ownerId: string) {
  const folder = await prisma.folder.findUnique({ where: { id } });
  if (!folder || folder.ownerId !== ownerId) {
    throw new Error('Folder not found');
  }

  const children = await prisma.folder.findMany({
    where: { parentId: id, ownerId },
    select: { id: true },
  });
  for (const child of children) {
    await deleteFolder(child.id, ownerId);
  }

  await prisma.file.deleteMany({ where: { parentId: id, ownerId } });

  return prisma.folder.delete({ where: { id } });
}

export async function renameFolder(id: number, name: string, ownerId: string) {
  const folder = await prisma.folder.findUnique({ where: { id } });
  if (!folder || folder.ownerId !== ownerId) {
    throw new Error('Folder not found');
  }

  return prisma.folder.update({
    where: { id },
    data: { name },
  });
}
