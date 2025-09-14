// backend/src/routes/diagnostics.ts
import type { FastifyInstance } from 'fastify';
import prisma from '@/services/prisma';
import { ensureBucket } from '@/utils/ensureBucket';

export default async function diagnostics(app: FastifyInstance) {
  app.get('/health', async () => ({ ok: true }));

  app.get('/health/db', async () => {
    await prisma.$queryRaw`select 1`;
    return { db: 'ok' };
  });

  app.get('/health/storage', async () => {
    await ensureBucket(); // uses BUCKET_NAME or 'files'
    return { storage: 'ok' };
  });
}
