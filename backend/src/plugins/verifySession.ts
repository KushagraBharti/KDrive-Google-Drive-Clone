import fp from 'fastify-plugin';
import { verifySession } from '@/controllers/auth';

declare module 'fastify' {
  interface FastifyRequest {
    /**
     * Authenticated user returned by verifySession.
     */
    user: any;
  }
}

/**
 * Fastify plugin that verifies the session for all `/api` routes.
 *
 * The plugin reads the `Authorization` header, validates the token using
 * `verifySession` and attaches the resulting user object to `request.user`.
 * Any failure results in a `401 Unauthorized` response.
 */
export default fp(async function verifySessionPlugin(app) {
  app.decorateRequest('user', null);

  app.addHook('preHandler', async (request, reply) => {
    // Skip non-API routes (e.g. analytics ingest)
    if (!request.raw.url?.startsWith('/api')) return;

    const token = (request.headers.authorization || '').replace('Bearer ', '');

    // Immediately return 401 if no token is provided
    if (!token) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }

    try {
      const user = await verifySession(token);
      request.user = user;
    } catch {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }
  });
});

