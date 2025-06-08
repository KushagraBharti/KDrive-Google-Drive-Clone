// src/scripts/test-db.ts
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url        = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("→ URL:", url);
console.log("→ Service Key defined?:", !!serviceKey);

if (!url || !serviceKey) {
  console.error("❌ Missing one of VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const { data, error } = await supabase.from("folder").select("*");
  if (error) {
    console.error("❌ Supabase error:", error);
    process.exit(1);
  }
  console.log("✅ Success:", data);
  process.exit(0);
}

main();
