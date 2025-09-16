import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';

import authRoutes from './routes/auth';
import folderRoutes from './routes/folders';
import fileRoutes from './routes/files';
import analyticsRoutes from './routes/analytics';
import storageRoutes from './routes/storage';

export const app = Fastify();

app.register(cors, { origin: true });
app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

app.register(authRoutes);
app.register(folderRoutes);
app.register(fileRoutes);
app.register(analyticsRoutes);
app.register(storageRoutes);
