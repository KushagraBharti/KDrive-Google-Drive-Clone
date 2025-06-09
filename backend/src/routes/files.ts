import { FastifyInstance } from 'fastify';
import { createFile, deleteFile, getFiles } from '@/controllers/files';
import { verifySession } from '@/controllers/auth';

console.log("Loading files.ts");

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
    const file = await createFile({ ...(request.body as any), ownerId: user.id });
    reply.send(file);
  });

  app.delete('/api/files/:id', async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const id = Number((request.params as any).id);
    const deleted = await deleteFile(id, user.id);
    reply.send(deleted);
  });
}
