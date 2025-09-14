// backend/src/routes/storage.ts
import type { FastifyInstance } from 'fastify';
import { ensureBucket } from '@/utils/ensureBucket';
import { supabaseAdmin } from '@/services/supabase';

const BUCKET = process.env.BUCKET_NAME || 'files';

export default async function storageRoutes(app: FastifyInstance) {
  // Upload via multipart/form-data with field "file" and optional "parentPath"
  app.post('/api/storage/upload', async (req, reply) => {
    const user = (req as any).user;
    if (!user?.id) return reply.code(401).send({ error: 'Unauthorized' });

    // @fastify/multipart exposes files via parts()
    const parts = req.parts();
    let filePart: any;
    let parentPath = '';

    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'file') {
        filePart = part;
      } else if (part.type === 'field' && part.fieldname === 'parentPath') {
        parentPath = String(part.value ?? '');
      }
    }

    if (!filePart) {
      return reply.code(400).send({ error: 'Missing file' });
    }

    const buf = await filePart.toBuffer();
    const ext = (filePart.filename?.split('.').pop() || '').toLowerCase();
    const ts = Date.now();
    const key = [user.id, parentPath, `${ts}-${filePart.filename}`]
      .filter(Boolean)
      .join('/');

    await ensureBucket(BUCKET, false);

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(key, buf, {
        upsert: false,
        contentType: filePart.mimetype || undefined,
      });

    if (error) {
      return reply.code(500).send({ error: error.message });
    }
    return reply.send({ ok: true, path: key });
  });
}
