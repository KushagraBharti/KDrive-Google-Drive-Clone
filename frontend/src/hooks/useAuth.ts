import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { supabaseClient } from '@/contexts/SupabaseContext'

export function useAuth() {
  const state = useContext(AuthContext)

  async function signInWithEmail(email: string, password: string) {
    return await supabaseClient.auth.signInWithPassword({ email, password })
  }

  async function signUpWithEmail(email: string, password: string) {
    return await supabaseClient.auth.signUp({ email, password })
  }

  async function signOut() {
    return await supabaseClient.auth.signOut()
  }

  return {
    ...state,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }
}
