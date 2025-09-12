import { FastifyInstance } from 'fastify';
import { createFile, deleteFile, getFiles, renameFile } from '@/controllers/files';
import { verifySession } from '@/controllers/auth';
import {
  getFilesSchema,
  createFileSchema,
  deleteFileSchema,
  renameFileSchema,
} from './schemas';

console.log("Loading files.ts");

export default async function (app: FastifyInstance) {
  app.get('/api/files/:parentId', { schema: getFilesSchema }, async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const { parentId } = request.params;
    const files = await getFiles(parentId, user.id);
    reply.send(files);
  });

  app.post('/api/files', { schema: createFileSchema }, async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const { name, size, path, parentId } = request.body;
    const file = await createFile({ name, size, path, parentId, ownerId: user.id });
    reply.send(file);
  });

  app.delete('/api/files/:id', { schema: deleteFileSchema }, async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const { id } = request.params;
    const deleted = await deleteFile(id, user.id);
    reply.send(deleted);
  });

  app.patch('/api/files/:id', { schema: renameFileSchema }, async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const { id } = request.params;
    const { name } = request.body;
    const updated = await renameFile(id, user.id, name);
    reply.send(updated);
  });
}
