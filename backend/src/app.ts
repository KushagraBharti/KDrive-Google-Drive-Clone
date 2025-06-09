import Fastify from 'fastify';
import cors from '@fastify/cors';

import authRoutes from './routes/auth';
import folderRoutes from './routes/folders';
import fileRoutes from './routes/files';

export const app = Fastify();

app.register(cors, { origin: true });

app.register(authRoutes);
app.register(folderRoutes);
app.register(fileRoutes);
