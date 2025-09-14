// backend/src/plugins/verifySession.ts
import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { supabaseAdmin } from '@/services/supabase';

declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: string; email?: string | null };
  }
}

const verifySessionPlugin: FastifyPluginAsync = async (app) => {
  app.decorateRequest('user', undefined);

  app.addHook('preHandler', async (req, reply) => {
    // Public endpoints (adjust as needed)
    const url = req.url;
    if (
      url === '/' ||
      url.startsWith('/health') ||
      url.startsWith('/auth') // your auth routes should remain open
    ) {
      return;
    }

    // Expect a Supabase JWT in Authorization: Bearer <token>
    const auth = req.headers.authorization;
    const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;

    // (Optional) support cookie-based token if you set it on the client
    const cookieToken =
      // @ts-ignore - cookies only exist if you register cookie plugin
      (req.cookies?.['sb-access-token'] as string | undefined) ||
      // some apps store a different cookie name
      // @ts-ignore
      (req.cookies?.['access_token'] as string | undefined);

    const token = bearer || cookieToken;
    if (!token) {
      return reply.code(401).send({ error: 'Missing Authorization bearer token' });
    }

    // Validate token with Admin client
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return reply.code(401).send({ error: 'Invalid or expired token' });
    }

    req.user = { id: data.user.id, email: data.user.email ?? null };
  });
};

export default fp(verifySessionPlugin);
