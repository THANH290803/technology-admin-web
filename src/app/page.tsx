"use client"

import { useState } from "react"
import { BrowserRouter } from "react-router-dom"
import { AdminDashboard } from "@/components/admin-dashboard"
import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  // Kiểm tra token ngay khi render
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const [isLoggedIn, setIsLoggedIn] = useState(!!token)

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} onBack={() => { }} />
  }

  return (
    <BrowserRouter>
      <AdminDashboard
        onLogout={() => {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setIsLoggedIn(false)
        }}
      />
    </BrowserRouter>
  )
}
