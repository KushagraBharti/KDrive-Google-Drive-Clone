import Fastify from 'fastify';
import cors from '@fastify/cors';

export const app = Fastify();

app.register(cors, { origin: true });  // allow cross-origin requests
app.register(import('./routes/auth'));
app.register(import('./routes/folders'));
app.register(import('./routes/files'));
