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
