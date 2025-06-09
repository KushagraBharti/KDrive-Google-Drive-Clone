import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export function useFiles(parentId: number) {
  const { session } = useAuth();
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    if (!session) return;
    const token = session.access_token;
    fetch(`/api/files/${parentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setFiles);
  }, [parentId, session]);

  return files;
}
