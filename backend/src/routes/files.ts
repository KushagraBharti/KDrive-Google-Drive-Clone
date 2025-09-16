import { FastifyInstance } from 'fastify';
import type { MultipartFile } from '@fastify/multipart';
import { randomUUID } from 'crypto';
import { createFile, deleteFile, getFiles, renameFile } from '@/controllers/files';
import { verifySession } from '@/controllers/auth';
import { supabaseAdmin } from '@/services/supabase';
import '@fastify/multipart';

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

    if (request.isMultipart && request.isMultipart()) {
      const fields = new Map<string, string>();
      const fileParts: Array<{ part: MultipartFile; buffer: Buffer }> = [];

      for await (const part of request.parts()) {
        if (part.type === 'file') {
          const filePart = part as MultipartFile;
          const buffer = await filePart.toBuffer();
          fileParts.push({ part: filePart, buffer });
        } else if (part.type === 'field') {
          fields.set(part.fieldname, String(part.value ?? ''));
        }
      }

      const parentIdValue = fields.get('parentId');
      const parentId = Number(parentIdValue ?? NaN);

      if (!Number.isFinite(parentId)) {
        reply.code(400).send({ error: 'parentId is required' });
        return;
      }

      if (fileParts.length === 0) {
        reply.code(400).send({ error: 'No files provided' });
        return;
      }

      const createdFiles = [];

      for (const { part, buffer } of fileParts) {
        const originalName = part.filename || 'file';
        const uniquePath = `${user.id}/${Date.now()}-${randomUUID()}-${originalName}`;

        try {
          const { error: uploadError } = await supabaseAdmin.storage
            .from('files')
            .upload(uniquePath, buffer, {
              contentType: part.mimetype,
              upsert: false,
            });

          if (uploadError) {
            throw new Error(uploadError.message);
          }

          const created = await createFile({
            name: originalName,
            size: buffer.length,
            path: uniquePath,
            parentId,
            ownerId: user.id,
          });

          createdFiles.push(created);
        } catch (error) {
          await supabaseAdmin.storage.from('files').remove([uniquePath]).catch(() => {});
          const message =
            error instanceof Error && error.message ? error.message : 'Failed to upload file';
          reply.code(500).send({ error: message });
          return;
        }
      }

      reply.send(createdFiles.length === 1 ? createdFiles[0] : createdFiles);
      return;
    }

    const { name, size, path, parentId } = request.body as any;
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
