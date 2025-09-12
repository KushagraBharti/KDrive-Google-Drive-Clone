import { describe, it, expect, beforeEach } from 'vitest';
import { app } from '@/app';
import { resetDb } from './setup';

describe('folder routes', () => {
  beforeEach(() => {
    resetDb();
  });

  it('creates and lists folders', async () => {
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/folders',
      headers: { authorization: 'Bearer token' },
      payload: { name: 'Test', parentId: null },
    });
    expect(createRes.statusCode).toBe(200);
    const folder = createRes.json();

    const listRes = await app.inject({
      method: 'GET',
      url: '/api/folders',
      headers: { authorization: 'Bearer token' },
    });
    expect(listRes.json()).toEqual([folder]);
  });

  it('renames and deletes folder', async () => {
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/folders',
      headers: { authorization: 'Bearer token' },
      payload: { name: 'Old', parentId: null },
    });
    const folder = createRes.json();

    const renameRes = await app.inject({
      method: 'PATCH',
      url: `/api/folders/${folder.id}`,
      headers: { authorization: 'Bearer token' },
      payload: { name: 'New' },
    });
    expect(renameRes.json().name).toBe('New');

    const deleteRes = await app.inject({
      method: 'DELETE',
      url: `/api/folders/${folder.id}`,
      headers: { authorization: 'Bearer token' },
    });
    expect(deleteRes.statusCode).toBe(200);

    const listRes = await app.inject({
      method: 'GET',
      url: '/api/folders',
      headers: { authorization: 'Bearer token' },
    });
    expect(listRes.json()).toEqual([]);
  });
});
