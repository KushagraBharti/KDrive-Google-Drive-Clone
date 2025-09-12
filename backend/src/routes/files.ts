import { FastifyInstance } from 'fastify';
import { createFile, deleteFile, getFiles, renameFile } from '@/controllers/files';
import { verifySession } from '@/controllers/auth';

export default async function (app: FastifyInstance) {
  app.get('/api/files/:parentId', async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const parentId = Number((request.params as any).parentId);
    const files = await getFiles(parentId, user.id);
    reply.send(files);
  });

  app.post('/api/files', async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const { name, size, path, parentId } = (request.body as any);
    const file = await createFile({ name, size, path, parentId, ownerId: user.id });
    reply.send(file);
  });

  app.delete('/api/files/:id', async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const id = Number((request.params as any).id);
    const deleted = await deleteFile(id, user.id);
    reply.send(deleted);
  });

  app.patch('/api/files/:id', async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const id = Number((request.params as any).id);
    const { name } = request.body as any;
    const updated = await renameFile(id, user.id, name);
    reply.send(updated);
  });
}
