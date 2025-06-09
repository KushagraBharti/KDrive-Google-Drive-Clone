import { app } from './app';

const port = Number(process.env.PORT) || 3001;

(async () => {
  try {
    await app.listen({ port });
    console.log(`Backend running at http://localhost:${port}`);
  } catch (err) {
    console.error("Failed to start Fastify:", err);
    process.exit(1);
  }
})();
