import prisma from '@/services/prisma';

export async function getFolders(parentId: number | null) {
  return prisma.folder.findMany({
    where: { parentId },
    orderBy: { id: 'asc' }
  });
}

export async function createFolder(args: {
  name: string;
  parentId: number | null;
  ownerId: string;
}) {
  return prisma.folder.create({ data: args });
}
