import { supabaseClient } from '@/services/supabase';

export async function verifySession(accessToken: string) {
  const { data, error } = await supabaseClient.auth.getUser(accessToken);
  if (error || !data.user) {
    throw new Error('Invalid session');
  }
  return data.user;
}
