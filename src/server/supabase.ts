import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()    // loads .env into process.env

const url = process.env.SUPABASE_URL!
const anonKey = process.env.SUPABASE_ANON_KEY!
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!  // if you need admin rights

export const supabaseAdmin = createClient(url, serviceRole)
export const supabaseClient = createClient(url, anonKey)
