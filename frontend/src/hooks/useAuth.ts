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

  async function signInWithGoogle() {
    return await supabaseClient.auth.signInWithOAuth({ provider: 'google' })
  }

  async function sendMagicLink(email: string) {
    return await supabaseClient.auth.signInWithOtp({ email })
  }

  async function signOut() {
    return await supabaseClient.auth.signOut()
  }

  return {
    ...state,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendMagicLink,
    signOut,
  }
}
