// frontend/src/lib/api.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function apiFetch<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(init.headers || {});
  headers.set('Accept', 'application/json');
  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = session?.access_token;
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    // credentials are optional if you only use Bearer;
    // keep 'include' if you ever switch to cookie auth.
    credentials: 'include',
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = json?.error || res.statusText;
    throw new Error(message);
  }
  return json as T;
}
