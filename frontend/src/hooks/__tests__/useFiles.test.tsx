import { renderHook, waitFor } from '@testing-library/react'
import { useFiles } from '@/hooks/useFiles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const mockAuth = { session: { access_token: 'token' } }
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockAuth,
}))

describe('useFiles', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 1, name: 'file' }]),
    }) as any
  })

  it('fetches files and exposes refetch', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useFiles(42), { wrapper })

    await waitFor(() => {
      expect(result.current.files).toEqual([{ id: 1, name: 'file' }])
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/files/42', {
      headers: { Authorization: 'Bearer token' },
    })

    await result.current.refetch()
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })
})
