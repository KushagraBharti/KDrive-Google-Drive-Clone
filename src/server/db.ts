// src/server/db.ts
import prisma from "@/src/lib/prisma";

export const db = {
  // get all folders under a given folderId
  async getFolders(folderId: number) {
    return prisma.folder.findMany({
      where: { parentId: folderId },
      orderBy: { id: "asc" },
    });
  },

  // get all files in a folder
  async getFiles(folderId: number) {
    return prisma.file.findMany({
      where: { parentId: folderId },
      orderBy: { id: "asc" },
    });
  },

  // create a new folder
  async createFolder(data: { name: string; parentId: number | null; ownerId: string }) {
    return prisma.folder.create({ data });
  },

  // create a new file record
  async createFile(data: {
    name: string;
    size: number;
    url: string;
    parentId: number;
    ownerId: string;
  }) {
    return prisma.file.create({ data });
  },

  // delete a file by ID (and return the deleted record)
  async deleteFile(fileId: number) {
    return prisma.file.delete({ where: { id: fileId } });
  },
};
