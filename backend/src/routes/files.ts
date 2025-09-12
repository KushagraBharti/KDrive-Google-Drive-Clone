import { FastifyInstance } from 'fastify';
import { createFile, deleteFile, getFiles, renameFile } from '@/controllers/files';
import {
  getFilesSchema,
  createFileSchema,
  deleteFileSchema,
  renameFileSchema,
} from './schemas';
import prisma from '@/services/prisma';
import { supabaseAdmin } from '@/services/supabase';

export default async function (app: FastifyInstance) {
  app.get('/api/files/:parentId', { schema: getFilesSchema }, async (request, reply) => {
    const user = request.user;
    const parentId = Number((request.params as any).parentId);
    const files = await getFiles(parentId, user.id);
    reply.send(files);
  });

  app.post('/api/files', { schema: createFileSchema }, async (request, reply) => {
    const user = request.user;
    const { name, size, path, parentId } = request.body as any;
    const file = await createFile({ name, size, path, parentId, ownerId: user.id });
    reply.send(file);
  });

  app.delete('/api/files/:id', { schema: deleteFileSchema }, async (request, reply) => {
    const user = request.user;
    const { id } = request.params as any;
    const deleted = await deleteFile(id, user.id);
    reply.send(deleted);
  });

  app.patch('/api/files/:id', { schema: renameFileSchema }, async (request, reply) => {
    const user = request.user;
    const { id } = request.params as any;
    const { name } = request.body as any;
    const updated = await renameFile(id, user.id, name);
    reply.send(updated);
  });

  app.post('/api/files/:id/share', async (request, reply) => {
    const user = request.user;
    const { id } = request.params as any;

    const file = await prisma.file.findFirst({
      where: { id: Number(id), ownerId: user.id },
    });

    if (!file) {
      reply.code(404).send({ error: 'File not found' });
      return;
    }

    const { data, error } = await supabaseAdmin.storage
      .from('files')
      .createSignedUrl(file.path, 60);

    if (error || !data?.signedUrl) {
      reply.code(500).send({ error: 'Failed to create signed URL' });
      return;
    }

    reply.send({ url: data.signedUrl });
  });
}

