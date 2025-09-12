import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_POSTHOG_KEY: z.string().optional(),
});

const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
  const message = _env.error.issues
    .map((i) => `${i.path.join('.')}: ${i.message}`)
    .join('; ');
  throw new Error(`Invalid environment variables: ${message}`);
}

export const env = _env.data;
