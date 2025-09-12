import { POSTHOG_API_HOST, POSTHOG_API_KEY } from '@/config/env';

const fetchFn: any = (globalThis as any).fetch;

export async function forwardToPostHog(payload: unknown) {
  return fetchFn(`${POSTHOG_API_HOST}/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(POSTHOG_API_KEY ? { Authorization: `Bearer ${POSTHOG_API_KEY}` } : {}),
    },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
  });
}
