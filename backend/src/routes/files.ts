// backend/src/routes/files.ts
import { FastifyInstance } from 'fastify';
import {
  createFile,
  deleteFile,
  getFiles,
  renameFile,
} from '@/controllers/files';
import {
  getFilesSchema,
  createFileSchema,
  deleteFileSchema,
  renameFileSchema,
} from './schemas';
import prisma from '@/services/prisma';
import { supabaseAdmin } from '@/services/supabase';
import { ensureBucket } from '@/utils/ensureBucket';

const BUCKET = process.env.BUCKET_NAME || 'files';

export default async function (app: FastifyInstance) {
  app.get(
    '/api/files/:parentId',
    { schema: getFilesSchema },
    async (request, reply) => {
      const user = (request as any).user;
      const parentId = Number((request.params as any).parentId);
      const files = await getFiles(parentId, user.id);
      reply.send(files);
    }
  );

  app.post(
    '/api/files',
    { schema: createFileSchema },
    async (request, reply) => {
      const user = (request as any).user;
      const { name, size, path, parentId } = request.body as any;

      // record in DB
      const file = await createFile({
        name,
        size,
        path,
        parentId,
        ownerId: user.id,
      });

      reply.send(file);
    }
  );

  app.delete(
    '/api/files/:id',
    { schema: deleteFileSchema },
    async (request, reply) => {
      const user = (request as any).user;
      const { id } = request.params as any;
      const deleted = await deleteFile(id, user.id);
      reply.send(deleted);
    }
  );

  app.patch(
    '/api/files/:id',
    { schema: renameFileSchema },
    async (request, reply) => {
      const user = (request as any).user;
      const { id } = request.params as any;
      const { name } = request.body as any;
      const updated = await renameFile(id, user.id, name);
      reply.send(updated);
    }
  );

  // create a short-lived signed url for the file
  app.post('/api/files/:id/share', async (request, reply) => {
    const user = (request as any).user;
    const { id } = request.params as any;

    const file = await prisma.file.findFirst({
      where: { id: Number(id), ownerId: user.id },
    });

    if (!file) {
      return reply.code(404).send({ error: 'File not found' });
    }

    // ensure the bucket exists (lazy)
    await ensureBucket(BUCKET, false);

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(file.path, 60);

    if (error || !data?.signedUrl) {
      return reply.code(500).send({ error: 'Failed to create signed URL' });
    }

    reply.send({ url: data.signedUrl });
  });
}
