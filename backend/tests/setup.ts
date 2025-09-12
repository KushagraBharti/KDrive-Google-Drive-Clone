import { vi } from 'vitest';

export const mockUser = { id: 'user1' };
vi.mock('@/controllers/auth', () => ({
  verifySession: vi.fn().mockResolvedValue(mockUser),
}));

// In-memory database
interface Folder { id: number; name: string; parentId: number | null; ownerId: string; createdAt: Date; }
interface File { id: number; name: string; size: number; url: string; path: string; parentId: number; ownerId: string; createdAt: Date; }

const db = {
  folders: [] as Folder[],
  files: [] as File[],
};

let folderId = 1;
let fileId = 1;

export function resetDb() {
  db.folders = [];
  db.files = [];
  folderId = 1;
  fileId = 1;
}

vi.mock('@/services/prisma', () => ({
  default: {
    folder: {
      findMany: async ({ where: { parentId, ownerId } }: any) =>
        db.folders.filter((f) => f.parentId === parentId && f.ownerId === ownerId),
      create: async ({ data }: any) => {
        const folder: Folder = { id: folderId++, createdAt: new Date(), ...data };
        db.folders.push(folder);
        return folder;
      },
      findUnique: async ({ where: { id } }: any) => db.folders.find((f) => f.id === id) || null,
      delete: async ({ where: { id } }: any) => {
        const idx = db.folders.findIndex((f) => f.id === id);
        const [folder] = db.folders.splice(idx, 1);
        return folder;
      },
      update: async ({ where: { id }, data }: any) => {
        const folder = db.folders.find((f) => f.id === id);
        if (folder) Object.assign(folder, data);
        return folder as Folder;
      },
    },
    file: {
      findMany: async ({ where: { parentId, ownerId } }: any) =>
        db.files.filter((f) => f.parentId === parentId && f.ownerId === ownerId),
      create: async ({ data }: any) => {
        const file: File = { id: fileId++, createdAt: new Date(), ...data };
        db.files.push(file);
        return file;
      },
      deleteMany: async ({ where: { parentId, ownerId } }: any) => {
        db.files = db.files.filter((f) => !(f.parentId === parentId && f.ownerId === ownerId));
        return { count: 0 };
      },
      delete: async ({ where: { id, ownerId } }: any) => {
        const idx = db.files.findIndex((f) => f.id === id && f.ownerId === ownerId);
        const [file] = db.files.splice(idx, 1);
        return file;
      },
      update: async ({ where: { id, ownerId }, data }: any) => {
        const file = db.files.find((f) => f.id === id && f.ownerId === ownerId);
        if (file) Object.assign(file, data);
        return file as File;
      },
    },
  },
}));

vi.mock('@/services/supabase', () => ({
  supabaseAdmin: {
    storage: {
      from: () => ({
        createSignedUrl: async (path: string) => ({ data: { signedUrl: `https://example.com/${path}` }, error: null }),
        createSignedUploadUrl: async (path: string) => ({ data: { token: 'signed-token' }, error: null }),
        remove: async () => ({ data: {}, error: null }),
      }),
    },
  },
  supabase: {},
}));
