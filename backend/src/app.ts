import Fastify from 'fastify';
import cors from '@fastify/cors';
import pino from 'pino';
import rateLimit from '@fastify/rate-limit';


import authRoutes from './routes/auth';
import folderRoutes from './routes/folders';
import fileRoutes from './routes/files';
import analyticsRoutes from './routes/analytics';
import storageRoutes from './routes/storage';

export const app = Fastify({
  logger: pino({ level: 'info' }),
});

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

app.register(cors, { origin: true });

app.addHook('onRequest', (request, reply, done) => {
  app.log.info({ method: request.method, url: request.url }, 'incoming request');
  done();
});

app.register(authRoutes);
app.register(folderRoutes);
app.register(fileRoutes);
app.register(analyticsRoutes);
app.register(storageRoutes);
