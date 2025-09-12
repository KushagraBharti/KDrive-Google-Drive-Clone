// src/utils/test-db.ts
import { supabaseAdmin } from '@/services/supabase';

async function main() {
  const { data, error } = await supabaseAdmin.from('folder').select('*');
  if (error) {
    console.error('❌ Supabase error:', error);
    process.exit(1);
  }
  console.log('✅ Success:', data);
  process.exit(0);
}

main();
