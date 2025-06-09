import { FastifyInstance } from 'fastify';
import { getFiles, createFile, deleteFile } from '@/controllers/files';

export default async function (app: FastifyInstance) {
  app.get('/api/files/:parentId', async (req, reply) => {
    const parentId = Number((req.params as any).parentId);
    const files = await getFiles(parentId);
    reply.send(files);
  });

  app.post('/api/files', async (req, reply) => {
    const file = await createFile(req.body as any);
    reply.send(file);
  });

  app.delete('/api/files/:id', async (req, reply) => {
    const id = Number((req.params as any).id);
    const file = await deleteFile(id);
    reply.send(file);
  });
}
