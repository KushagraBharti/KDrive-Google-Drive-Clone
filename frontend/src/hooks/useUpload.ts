import { useAuth } from './useAuth';
import { supabaseClient } from '@/contexts/SupabaseContext';

export function useUpload() {
  const { session } = useAuth();

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

    const { error: uploadError } = await supabaseClient.storage
      .from('files')
      .uploadToSignedUrl(path, token, file, { contentType: file.type });

    if (uploadError) throw uploadError;

    // Persist metadata on the backend (backend generates signed URL for DB)
    const res = await fetch('/api/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        path,
        parentId
      })
    })

    if (!res.ok) {
      throw new Error('Failed to save file metadata')
    }
  }

  return { uploadFile };
}
