import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export function useFolders(parentId: number | null) {
  const { session } = useAuth();
  const [folders, setFolders] = useState<any[]>([]);

  useEffect(() => {
    if (!session) return;
    const token = session.access_token;
    fetch(`/api/folders/${parentId ?? ''}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setFolders);
  }, [parentId, session]);

  return folders;
}
