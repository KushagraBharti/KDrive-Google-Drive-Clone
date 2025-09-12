import Fastify from 'fastify';
import cors from '@fastify/cors';

import authRoutes from './routes/auth';
import folderRoutes from './routes/folders';
import fileRoutes from './routes/files';
import analyticsRoutes from './routes/analytics';
import storageRoutes from './routes/storage';
import verifySessionPlugin from './plugins/verifySession';

export const app = Fastify();

app.register(cors, { origin: true });

// Globally verify sessions for all API routes
app.register(verifySessionPlugin);

app.register(authRoutes);
app.register(folderRoutes);
app.register(fileRoutes);
app.register(analyticsRoutes);
app.register(storageRoutes);
