import { createClient } from "@supabase/supabase-js";
import "dotenv/config"; // loads .env into process.env

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase

