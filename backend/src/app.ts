// backend/src/app.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import {
  ZodTypeProvider,
  validatorCompiler,
  serializerCompiler,
} from 'fastify-type-provider-zod';
import rateLimit from '@fastify/rate-limit';

import authRoutes from './routes/auth';
import folderRoutes from './routes/folders';
import fileRoutes from './routes/files';
import analyticsRoutes from './routes/analytics';
import storageRoutes from './routes/storage'; // your existing file; optional if you replace with the minimal one below
import diagnostics from '@/routes/diagnostics';

import verifySessionPlugin from './plugins/verifySession';

export const app = Fastify({
  logger: { level: 'info' },
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

// Reflect the exact frontend origin and allow credentials if you rely on cookies.
// For Bearer tokens, credentials is optional but harmless.
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.register(cors, {
  origin: [FRONTEND_ORIGIN],
  credentials: true,
});

// multipart (only needed if your upload route accepts files)
app.register(multipart, {
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB example
});

// Global auth guard (after public plugins)
app.register(verifySessionPlugin);

// nice request log
app.addHook('onRequest', (request, _reply, done) => {
  app.log.info({ method: request.method, url: request.url }, 'incoming request');
  done();
});

// Register routes
app.register(authRoutes);
app.register(folderRoutes);
app.register(fileRoutes);
app.register(analyticsRoutes);
app.register(storageRoutes);
app.register(diagnostics);
