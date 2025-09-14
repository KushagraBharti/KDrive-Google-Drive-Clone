import { FastifyInstance } from 'fastify';

export default async function (app: FastifyInstance) {
  app.get('/api/auth/me', async (req, reply) => {
    reply.send(req.user);
  });
}
