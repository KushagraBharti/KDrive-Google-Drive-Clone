import { app } from './app';
import { ensureFilesBucket } from './utils/ensureBucket';

const port = Number(process.env.PORT) || 3001;

(async () => {
  try {
    await ensureFilesBucket();
    await app.listen({ port });
    console.log(`Backend running at http://localhost:${port}`);
  } catch (err) {
    console.error("Failed to start Fastify:", err);
    process.exit(1);
  }
})();
