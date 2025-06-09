import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const url        = process.env.VITE_SUPABASE_URL!;
const anonKey    = process.env.VITE_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin  = createClient(url, serviceKey);
export const supabaseClient = createClient(url, anonKey);
