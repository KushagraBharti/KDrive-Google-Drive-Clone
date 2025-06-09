// src/lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const url        = process.env.VITE_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(url, serviceKey);
