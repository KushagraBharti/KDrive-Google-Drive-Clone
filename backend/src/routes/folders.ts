import { FastifyInstance } from 'fastify';
import { createFolder, getFolders, deleteFolder, renameFolder } from '@/controllers/folders';
import { verifySession } from '@/controllers/auth';

console.log("Loading folders.ts");

export default async function (app: FastifyInstance) {
  app.get('/api/folders/:parentId?', async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const param = (request.params as any).parentId;
    const parentId = param ? Number(param) : null;
    const folders = await getFolders(parentId, user.id);
    reply.send(folders);
  });

  app.post('/api/folders', async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const { name, parentId } = request.body as any;
    const folder = await createFolder({ name, parentId: parentId ?? null, ownerId: user.id });
    reply.send(folder);
  });

  app.delete('/api/folders/:id', async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const id = Number((request.params as any).id);
    const deleted = await deleteFolder(id, user.id);
    reply.send(deleted);
  });

  app.patch('/api/folders/:id', async (request, reply) => {
    const token = (request.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    const id = Number((request.params as any).id);
    const { name } = request.body as any;
    const folder = await renameFolder(id, name, user.id);
    reply.send(folder);
  });
}
