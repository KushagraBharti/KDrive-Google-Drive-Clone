import 'dotenv/config';

export const DATABASE_URL = process.env.DATABASE_URL!;
export const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!DATABASE_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing environment variables');
}
