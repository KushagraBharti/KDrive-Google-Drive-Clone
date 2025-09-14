// backend/src/utils/retry.ts

/**
 * Tiny retry helper to smooth out transient Supabase/DB hiccups.
 * Usage:
 *   await retry(() => supabaseAdmin.storage.listBuckets(), 3, 800)
 */
export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 800
): Promise<T> {
  let lastErr: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  throw lastErr;
}
