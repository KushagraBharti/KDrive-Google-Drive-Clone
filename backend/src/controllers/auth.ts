import { supabaseClient } from '@/services/supabase';

export async function verifySession(token: string) {
  const { data, error } = await supabaseClient.auth.getUser(token);
  if (error || !data.user) throw new Error('Invalid session');
  return data.user;
}
