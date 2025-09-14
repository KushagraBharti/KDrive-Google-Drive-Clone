import { describe, it, expect, beforeEach } from 'vitest';
import { app } from '@/app';
import { resetDb } from './setup';

describe('file routes', () => {
  beforeEach(() => {
    resetDb();
  });

  it('creates, lists, renames and deletes files', async () => {
    // create parent folder
    const folderRes = await app.inject({
      method: 'POST',
      url: '/api/folders',
      headers: { authorization: 'Bearer token' },
      payload: { name: 'Folder', parentId: null },
    });
    const folder = folderRes.json();

    const createRes = await app.inject({
      method: 'POST',
      url: '/api/files',
      headers: { authorization: 'Bearer token' },
      payload: { name: 'file.txt', size: 1, path: 'path/file.txt', parentId: folder.id },
    });
    expect(createRes.statusCode).toBe(200);
    const file = createRes.json();

    const listRes = await app.inject({
      method: 'GET',
      url: `/api/files/${folder.id}`,
      headers: { authorization: 'Bearer token' },
    });
    expect(listRes.json()).toEqual([file]);

    const renameRes = await app.inject({
      method: 'PATCH',
      url: `/api/files/${file.id}`,
      headers: { authorization: 'Bearer token' },
      payload: { name: 'renamed.txt' },
    });
    expect(renameRes.json().name).toBe('renamed.txt');

    const deleteRes = await app.inject({
      method: 'DELETE',
      url: `/api/files/${file.id}`,
      headers: { authorization: 'Bearer token' },
    });
    expect(deleteRes.statusCode).toBe(200);

    const listRes2 = await app.inject({
      method: 'GET',
      url: `/api/files/${folder.id}`,
      headers: { authorization: 'Bearer token' },
    });
    expect(listRes2.json()).toEqual([]);
  });
});
