import { z } from 'zod';

// Folder schemas
export const getFoldersSchema = {
  params: z.object({
    parentId: z.coerce.number().optional(),
  }),
};

export const createFolderSchema = {
  body: z.object({
    name: z.string().min(1),
    parentId: z.coerce.number().nullable().optional(),
  }),
};

export const deleteFolderSchema = {
  params: z.object({ id: z.coerce.number() }),
};

export const renameFolderSchema = {
  params: z.object({ id: z.coerce.number() }),
  body: z.object({ name: z.string().min(1) }),
};

// File schemas
export const getFilesSchema = {
  params: z.object({ parentId: z.coerce.number() }),
};

export const createFileSchema = {
  body: z.object({
    name: z.string().min(1),
    size: z.coerce.number(),
    path: z.string().min(1),
    parentId: z.coerce.number(),
  }),
};

export const deleteFileSchema = {
  params: z.object({ id: z.coerce.number() }),
};

export const renameFileSchema = {
  params: z.object({ id: z.coerce.number() }),
  body: z.object({ name: z.string().min(1) }),
};
