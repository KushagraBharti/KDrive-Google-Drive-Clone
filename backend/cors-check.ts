import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify();
await app.register(cors, { origin: true });
const res = await app.inject({ method: 'GET', url: '/', headers: { Origin: 'http://example.com' } });
console.log(res.headers['access-control-allow-origin']);
await app.close();
