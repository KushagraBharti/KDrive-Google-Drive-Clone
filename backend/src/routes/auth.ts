import { FastifyInstance } from 'fastify';
import { verifySession } from '@/controllers/auth';

console.log("Loading auth.ts");

export default async function (app: FastifyInstance) {
  app.get('/api/auth/me', async (req, reply) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    const user = await verifySession(token);
    reply.send(user);
  });
}
