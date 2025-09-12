import { renderHook } from '@testing-library/react'
import { AuthContext } from '@/contexts/AuthContext'

vi.mock('@/contexts/SupabaseContext', () => {
  const auth = {
    signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    updateUser: vi.fn().mockResolvedValue({ data: {}, error: null }),
  }
  return { supabaseClient: { auth } }
})

import { supabaseClient } from '@/contexts/SupabaseContext'
import { useAuth } from '@/hooks/useAuth'

const { signInWithPassword, signUp, signOut, updateUser } = supabaseClient.auth as any

describe('useAuth', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={{ user: { id: '1' } as any, session: { access_token: 'token' } as any }}>
      {children}
    </AuthContext.Provider>
  )

  it('provides auth state and methods', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toEqual({ id: '1' })
    await result.current.signInWithEmail('a@b.com', 'pw')
    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pw' })

    await result.current.signUpWithEmail('c@d.com', 'pw', 'Jane')
    expect(signUp).toHaveBeenCalledWith({ email: 'c@d.com', password: 'pw' })
    expect(updateUser).toHaveBeenCalledWith({ data: { name: 'Jane' } })

    await result.current.signOut()
    expect(signOut).toHaveBeenCalled()
  })
})
