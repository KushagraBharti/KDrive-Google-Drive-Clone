// src/pages/SignInPage.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const { signUp, signIn, user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (loading) return <p className="text-center">Loading…</p>;
  if (user) {
    window.location.href = "/drive";
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const fn = isSignUp ? signUp : signIn;
    const error = await fn(email, password);
    if (error) setErrorMsg(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg space-y-4 w-80"
      >
        <h2 className="text-white text-xl">
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>
        {errorMsg && <p className="text-red-400">{errorMsg}</p>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        <p className="text-slate-400 text-sm text-center">
          {isSignUp
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp((v) => !v)}
            className="text-blue-400 underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}
