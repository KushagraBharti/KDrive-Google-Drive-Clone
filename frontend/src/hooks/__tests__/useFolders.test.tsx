import { renderHook, waitFor } from '@testing-library/react'
import { useFolders } from '@/hooks/useFolders'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const mockAuth = { session: { access_token: 'token' } }
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockAuth,
}))

describe('useFolders', () => {
  beforeEach(() => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'Folder' }]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1, name: 'Renamed' }),
      })
      .mockResolvedValueOnce({ ok: true }) as any
  })

  it('handles fetching, renaming and deleting', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useFolders(null), { wrapper })

    await waitFor(() => {
      expect(result.current.folders).toEqual([{ id: 1, name: 'Folder' }])
    })

    expect(global.fetch).toHaveBeenNthCalledWith(1, '/api/folders/', {
      headers: { Authorization: 'Bearer token' },
    })

    await result.current.renameFolder(1, 'Renamed')
    expect(global.fetch).toHaveBeenNthCalledWith(2, '/api/folders/1', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Renamed' }),
    })

    await waitFor(() => {
      expect(result.current.folders).toEqual([{ id: 1, name: 'Renamed' }])
    })

    await result.current.deleteFolder(1)
    expect(global.fetch).toHaveBeenNthCalledWith(3, '/api/folders/1', {
      method: 'DELETE',
      headers: { Authorization: 'Bearer token' },
    })

    await waitFor(() => {
      expect(result.current.folders).toEqual([])
    })
  })
})
