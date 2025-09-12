import { supabase } from '@/services/supabase';

export async function verifySession(accessToken: string) {
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    throw new Error('Invalid session');
  }
  return data.user;
}
