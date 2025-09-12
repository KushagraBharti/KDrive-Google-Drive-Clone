import { renderHook, waitFor } from '@testing-library/react'
import { useFiles } from '@/hooks/useFiles'

const mockAuth = { session: { access_token: 'token' } }
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockAuth,
}))

describe('useFiles', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([{ id: 1, name: 'file' }]),
    }) as any
  })

  it('fetches files and exposes refetch', async () => {
    const { result } = renderHook(() => useFiles(42))

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
