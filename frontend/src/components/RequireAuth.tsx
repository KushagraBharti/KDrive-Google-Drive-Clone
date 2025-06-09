import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type React from "react";

export default function RequireAuth({ children }: { children: React.ReactElement }) {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/signin" />;
  }

  return children;
}
