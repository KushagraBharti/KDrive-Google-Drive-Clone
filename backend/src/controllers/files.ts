import prisma from '@/services/prisma';

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
  parentId: number;
  ownerId: string;
}) {
  return prisma.file.create({ data: args });
}

export function deleteFile(id: number, ownerId: string) {
  return prisma.file.delete({
    where: { id, ownerId },
  });
}
