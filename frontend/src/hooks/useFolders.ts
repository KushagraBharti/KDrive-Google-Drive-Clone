import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export function useFolders(parentId: number | null) {
  const { session } = useAuth();
  const [folders, setFolders] = useState<any[]>([]);

  const fetchFolders = async () => {
    if (!session) return;
    const token = session.access_token;
    const res = await fetch(`/api/folders/${parentId ?? ''}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setFolders(data);
  };

  useEffect(() => {
    fetchFolders();
  }, [parentId, session]);

  const createFolder = async (name: string) => {
    if (!session) return;
    const token = session.access_token;
    await fetch('/api/folders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, parentId })
    });
    await fetchFolders();
  };

  return { folders, createFolder, refetch: fetchFolders };
}
