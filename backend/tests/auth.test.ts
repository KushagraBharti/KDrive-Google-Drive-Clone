import { describe, it, expect } from 'vitest';
import { app } from '@/app';

describe('auth routes', () => {
  it('returns current user', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: { authorization: 'Bearer token' },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ id: 'user1' });
  });
});
