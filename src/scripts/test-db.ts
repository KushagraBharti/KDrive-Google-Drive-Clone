// src/scripts/test-db.ts
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl     = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.from("Folder").select("*");
  if (error) {
    console.error("❌ Supabase error:", error);
    process.exit(1);
  }
  console.log("✅ Supabase connected. Folders:", data);
}

main();
