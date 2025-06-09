import prisma from '@/services/prisma';

export async function getFiles(parentId: number) {
  return prisma.file.findMany({
    where: { parentId },
    orderBy: { id: 'asc' }
  });
}

export async function createFile(args: {
  name: string;
  size: number;
  url: string;
  parentId: number;
  ownerId: string;
}) {
  return prisma.file.create({ data: args });
}

export async function deleteFile(id: number) {
  return prisma.file.delete({ where: { id } });
}
