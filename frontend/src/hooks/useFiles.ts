import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export function useFiles(parentId: number) {
  const { session } = useAuth();
  const [files, setFiles] = useState<any[]>([]);

  const fetchFiles = async () => {
    if (!session) return;
    const token = session.access_token;
    const res = await fetch(`/api/files/${parentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, [parentId, session]);

  return { files, refetch: fetchFiles };
}
