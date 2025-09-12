import { test } from 'node:test';
import assert from 'node:assert';
import Fastify from 'fastify';

// Provide dummy environment variables expected by the plugin
process.env.DATABASE_URL = 'postgresql://localhost/test';
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role';
process.env.SUPABASE_ANON_KEY = 'anon-key';

// Dynamically import the plugin after setting env variables
const { default: verifySessionPlugin } = await import('../src/plugins/verifySession');

test('unauthorized requests receive 401', async () => {
  const app = Fastify();
  app.register(verifySessionPlugin);
  app.get('/api/protected', async (req, reply) => {
    reply.send({ ok: true });
  });
  await app.ready();

  const res = await app.inject({ method: 'GET', url: '/api/protected' });
  assert.strictEqual(res.statusCode, 401);

  await app.close();
});

