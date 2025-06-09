import { useAuth } from './useAuth';
import { supabaseClient } from '@/contexts/SupabaseContext';

export function useUpload() {
  const { session } = useAuth();

  async function uploadFile(file: File, parentId: number) {
    if (!session) throw new Error('Not authenticated');
    const { data, error } = await supabaseClient.storage
      .from('files')
      .upload(`${session.user.id}/${Date.now()}-${file.name}`, file);

    if (error) throw error;

    const url = supabaseClient.storage.from('files').getPublicUrl(data.path).data.publicUrl;

    await fetch('/api/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        url,
        parentId
      })
    });
  }

  return { uploadFile };
}
