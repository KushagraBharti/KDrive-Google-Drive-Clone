// backend/src/server.ts
import { app } from './app';

const port = Number(process.env.PORT) || 3001;

(async () => {
  try {
    // NOTE: no storage/bucket calls on boot — we keep those lazy.
    await app.listen({ port });
    app.log.info(`Backend running at http://localhost:${port}`);
  } catch (err) {
    app.log.error({ err }, 'Failed to start Fastify');
    process.exit(1);
  }
})();
