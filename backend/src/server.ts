import { app } from './app';
import { ensureFilesBucket } from './utils/ensureBucket';

const port = Number(process.env.PORT) || 3001;

(async () => {
  try {
    await ensureFilesBucket();
    await app.listen({ port });
    app.log.info(`Backend running at http://localhost:${port}`);
  } catch (err) {
    app.log.error({ err }, 'Failed to start Fastify');
    process.exit(1);
  }
})();
