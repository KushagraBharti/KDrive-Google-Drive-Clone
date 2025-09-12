import posthog from 'posthog-js';
import { env } from '@/env';

export function initPosthog() {
  const key = env.VITE_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: '/ingest',
  });
}

export default posthog;
