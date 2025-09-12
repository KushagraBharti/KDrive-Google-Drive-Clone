import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { supabaseClient } from '@/contexts/SupabaseContext'

export function useAuth() {
  const state = useContext(AuthContext)

  async function signInWithEmail(email: string, password: string) {
    return await supabaseClient.auth.signInWithPassword({ email, password })
  }

  async function signUpWithEmail(
    email: string,
    password: string,
    name: string
  ) {
    const result = await supabaseClient.auth.signUp({ email, password })
    if (!result.error) {
      const { error } = await supabaseClient.auth.updateUser({
        data: { name },
      })
      if (error) {
        return { ...result, error }
      }
    }
    return result
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
