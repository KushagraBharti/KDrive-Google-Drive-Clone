// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import { AuthProvider } from "@/hooks/useAuth";
import "./index.css";

// 1️⃣ create one QueryClient for your whole app
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 2️⃣ your Supabase auth context */}
    <AuthProvider>
      {/* 3️⃣ wrap in React Query provider */}
      <QueryClientProvider client={queryClient}>
        {/* 4️⃣ your single BrowserRouter */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
