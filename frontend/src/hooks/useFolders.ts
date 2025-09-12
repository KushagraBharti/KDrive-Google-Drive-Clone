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

  const renameFolder = async (id: number, name: string) => {
    if (!session) return;
    const token = session.access_token;
    const res = await fetch(`/api/folders/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    setFolders((prev) => prev.map((f) => (f.id === id ? data : f)));
  };

  const deleteFolder = async (id: number) => {
    if (!session) return;
    const token = session.access_token;
    await fetch(`/api/folders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  return { folders, refetch: fetchFolders, renameFolder, deleteFolder };
}
