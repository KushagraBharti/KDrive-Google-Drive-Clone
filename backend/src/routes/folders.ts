import { FastifyInstance } from 'fastify';
import {
  createFolder,
  getFolders,
  deleteFolder,
  renameFolder,
} from '@/controllers/folders';
import { verifySession } from '@/controllers/auth';
import {
  getFoldersSchema,
  createFolderSchema,
  deleteFolderSchema,
  renameFolderSchema,
} from './schemas';

export default async function (app: FastifyInstance) {
  app.get('/api/folders/:parentId?', { schema: getFoldersSchema }, async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const { parentId } = request.params;
    const folders = await getFolders(parentId ?? null, user.id);
    reply.send(folders);
  });

  app.post('/api/folders', { schema: createFolderSchema }, async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const { name, parentId } = request.body;
    const folder = await createFolder({ name, parentId: parentId ?? null, ownerId: user.id });
    reply.send(folder);
  });

  app.delete('/api/folders/:id', { schema: deleteFolderSchema }, async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const { id } = request.params;
    const deleted = await deleteFolder(id, user.id);
    reply.send(deleted);
  });

  app.patch('/api/folders/:id', { schema: renameFolderSchema }, async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const { id } = request.params;
    const { name } = request.body;
    const folder = await renameFolder(id, name, user.id);
    reply.send(folder);
  });
}
