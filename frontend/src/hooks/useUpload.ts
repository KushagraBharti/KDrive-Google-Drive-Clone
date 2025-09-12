import { useState } from 'react';
import { useAuth } from './useAuth';
import { supabaseClient } from '@/contexts/SupabaseContext';

export function useUpload() {
  const { session } = useAuth();
  const [progress, setProgress] = useState<{ loaded: number; total: number } | null>(
    null
  );

  async function uploadFile(file: File, parentId: number) {
    if (!session) throw new Error('Not authenticated');
    // Ask backend for a signed upload token and path (no storage policy needed)
    const uploadUrlRes = await fetch('/api/storage/signed-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ fileName: file.name }),
    });

    if (!uploadUrlRes.ok) {
      throw new Error('Failed to get signed upload URL');
    }

    const { path, token } = await uploadUrlRes.json();

    const storageUrl: string = (supabaseClient as any).storageUrl;
    const cleanPath = path.replace(/^\/|\/$/g, '').replace(/\/+/g, '/');
    const uploadUrl = new URL(
      `object/upload/sign/files/${cleanPath}`,
      storageUrl
    );
    uploadUrl.searchParams.set('token', token);

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress({ loaded: e.loaded, total: e.total });
        }
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));

      xhr.open('PUT', uploadUrl.toString());

      const formData = new FormData();
      formData.append('cacheControl', '3600');
      formData.append('', file);

      xhr.send(formData);
    });

    // Persist metadata on the backend (backend generates signed URL for DB)
    const res = await fetch('/api/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        path,
        parentId,
      }),
    });

    setProgress(null);

    if (!res.ok) {
      throw new Error('Failed to save file metadata');
    }
  }

  return { uploadFile, progress };
}
