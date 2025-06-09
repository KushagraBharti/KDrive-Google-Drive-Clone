// frontend/src/App.tsx
/* eslint-disable react/jsx-no-useless-fragment */
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import LandingPage from "@/pages/LandingPage"
import SignIn from "@/pages/SignIn"
import DriveView from "@/pages/DriveView"
import RequireAuth from "@/components/RequireAuth"

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Drive - root alias */}
        <Route path="/drive" element={<Navigate to="/drive/root" replace />} />

        {/* Drive - nested folders */}
        <Route
          path="/drive/:folderId/*"
          element={
            <RequireAuth>
              <DriveView />
            </RequireAuth>
          }
        />

        {/* Catch-all → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
