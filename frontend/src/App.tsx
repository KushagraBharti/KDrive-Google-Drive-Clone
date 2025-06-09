"use client"

import { useState } from "react"
import DriveView from "@/pages/DriveView"
import LandingPage from "@/pages/LandingPage"
import SignIn from "@/pages/SignIn"

export default function App() {
  const [page, setPage] = useState<'landing' | 'signin' | 'drive'>('drive')

  if (page === 'landing') return <LandingPage />
  if (page === 'signin') return <SignIn />
  return <DriveView />
}
