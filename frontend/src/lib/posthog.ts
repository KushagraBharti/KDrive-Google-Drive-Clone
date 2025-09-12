import posthog from 'posthog-js';

export function initPosthog() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: '/ingest',
  });
}

export default posthog;
