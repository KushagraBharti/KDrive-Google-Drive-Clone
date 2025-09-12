import Fastify from 'fastify';
import cors from '@fastify/cors';
import {
  ZodTypeProvider,
  validatorCompiler,
  serializerCompiler,
} from 'fastify-type-provider-zod';
import pino from 'pino';
import rateLimit from '@fastify/rate-limit';

import authRoutes from './routes/auth';
import folderRoutes from './routes/folders';
import fileRoutes from './routes/files';
import analyticsRoutes from './routes/analytics';
import storageRoutes from './routes/storage';
import verifySessionPlugin from './plugins/verifySession';

export const app = Fastify({
  logger: { level: 'info' },
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

app.register(cors, { origin: true });

// Globally verify sessions for all API routes
app.register(verifySessionPlugin);

app.addHook('onRequest', (request, reply, done) => {
  app.log.info({ method: request.method, url: request.url }, 'incoming request');
  done();
});

app.register(authRoutes);
app.register(folderRoutes);
app.register(fileRoutes);
app.register(analyticsRoutes);
app.register(storageRoutes);
