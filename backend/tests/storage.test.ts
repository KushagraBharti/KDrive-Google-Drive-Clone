import { describe, it, expect } from 'vitest';
import { app } from '@/app';

describe('storage routes', () => {
  it('creates a signed upload url', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/storage/signed-upload',
      headers: { authorization: 'Bearer token' },
      payload: { fileName: 'test.txt' },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('path');
    expect(body).toHaveProperty('token');
  });
});
