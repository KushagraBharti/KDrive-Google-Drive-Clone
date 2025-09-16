import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export function useFiles(parentId: number) {
  const { session } = useAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFiles = useCallback(async () => {
    if (!session) {
      setFiles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const token = session.access_token;
    try {
      const res = await fetch(`/api/files/${parentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFiles(data);
    } finally {
      setIsLoading(false);
    }
  }, [parentId, session]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, isLoading, refetch: fetchFiles };
}
