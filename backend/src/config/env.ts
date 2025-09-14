import 'dotenv/config';

export const DATABASE_URL = process.env.DATABASE_URL || '';
export const DIRECT_URL = process.env.DIRECT_URL || '';
// Prefer backend env names; fall back to Vite-prefixed names if present.
export const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const POSTHOG_API_HOST =
  process.env.POSTHOG_API_HOST || 'https://app.posthog.com';
export const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY || '';

const missing: string[] = [];
if (!DATABASE_URL) missing.push('DATABASE_URL');
if (!DIRECT_URL) missing.push('DIRECT_URL');
if (!SUPABASE_URL) missing.push('SUPABASE_URL or VITE_SUPABASE_URL');
if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');

if (missing.length) {
  throw new Error(
    `Missing environment variables: ${missing.join(', ')}`
  );
}
