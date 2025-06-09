"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import LandingPage from "@/pages/LandingPage";
import SignInPage from "@/pages/SignInPage";
import DriveView from "@/pages/DriveView"; // whatever your drive page is

export default function App() {
  const { user, loading } = useAuth();

  // while supabase is checking session…
  if (loading) return <div className="text-center p-8">Loading…</div>;

  return (
    <Routes>
      {/* public */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/signin"
        element={
          user ? <Navigate to="/drive" replace /> : <SignInPage />
        }
      />

      {/* protected */}
      <Route
        path="/drive/*"
        element={
          user ? <DriveView /> : <Navigate to="/signin" replace />
        }
      />

      {/* catch-all: redirect unknown URLs */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
