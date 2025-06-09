import { createContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabaseClient } from './SupabaseContext';

interface AuthState {
  user: User | null;
  session: Session | null;
}

export const AuthContext = createContext<AuthState>({ user: null, session: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, session: null });

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) =>
      setState({ user: data.session?.user ?? null, session: data.session })
    );

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setState({ user: session?.user ?? null, session });
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
