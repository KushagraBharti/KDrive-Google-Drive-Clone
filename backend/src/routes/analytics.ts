import { FastifyInstance } from 'fastify';
import { forwardToPostHog } from '@/services/analytics';

export default async function (app: FastifyInstance) {
  app.post('/ingest', async (request, reply) => {
    const res = await forwardToPostHog(request.body);
    const text = await res.text();
    reply
      .status(res.status)
      .headers({
        'content-type': res.headers.get('content-type') ?? 'application/json',
      })
      .send(text);
  });
}
