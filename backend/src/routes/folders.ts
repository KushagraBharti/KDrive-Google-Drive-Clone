import { FastifyInstance } from 'fastify';
import { getFolders, createFolder } from '@/controllers/folders';

export default async function (app: FastifyInstance) {
  app.get('/api/folders/:parentId', async (req, reply) => {
    const parentId = Number((req.params as any).parentId);
    const folders = await getFolders(isNaN(parentId) ? null : parentId);
    reply.send(folders);
  });

  app.post('/api/folders', async (req, reply) => {
    const { name, parentId, ownerId } = req.body as any;
    const folder = await createFolder({ name, parentId, ownerId });
    reply.send(folder);
  });
}
