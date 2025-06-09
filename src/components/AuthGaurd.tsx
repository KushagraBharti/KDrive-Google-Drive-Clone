import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (user === null) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}
