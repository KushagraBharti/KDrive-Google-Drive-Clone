import { FastifyInstance } from 'fastify';
import { forwardToPostHog } from '@/services/analytics';

console.log("Loading analytics.ts");

export default async function (app: FastifyInstance) {
  app.post(
    '/ingest',
    {
      config: {
        rateLimit: {
          max: 1000,
          timeWindow: '1 minute',
        },
      },
    },
    async (request, reply) => {
      const res = await forwardToPostHog(request.body);
      const text = await res.text();
      reply
        .status(res.status)
        .headers({
        'content-type': res.headers.get('content-type') ?? 'application/json',
      })
      .send(text);
    }
  );
}
