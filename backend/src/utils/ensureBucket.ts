// backend/src/utils/ensureBucket.ts
import { supabaseAdmin } from '@/services/supabase';
import { retry } from './retry';

const DEFAULT_BUCKET = process.env.BUCKET_NAME || 'files';

/**
 * Ensures a storage bucket exists. Does NOT run on server boot; call lazily.
 */
export async function ensureBucket(
  name: string = DEFAULT_BUCKET,
  makePublic = false
) {
  // list with retry (mitigates transient 544 timeouts)
  const { data: buckets, error: listErr } = await retry(
    () => supabaseAdmin.storage.listBuckets(),
    3,
    800
  );
  if (listErr) throw listErr;

  // IMPORTANT: compare by name (not id)
  if (buckets?.some((b) => b.name === name)) return;

  const { error: createErr } = await retry(
    () => supabaseAdmin.storage.createBucket(name, { public: makePublic }),
    3,
    800
  );
  if (createErr) {
    // tolerate race in multi-instance envs
    if (/already exists/i.test(createErr.message ?? '')) return;
    throw createErr;
  }
}

/** Convenience wrapper that uses BUCKET_NAME (default 'files') */
export async function ensureFilesBucket() {
  await ensureBucket(DEFAULT_BUCKET, false);
}
