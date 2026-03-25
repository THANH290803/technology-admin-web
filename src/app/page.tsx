"use client";

import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AdminDashboard } from "@/components/admin-dashboard";
import { LoginForm } from "@/components/login-form";
import axios from "axios";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hàm xử lý logout tập trung
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/"; // Refresh lại trang cho sạch sẽ
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    // 🛑 CHỐT CHẶN TỰ ĐỘNG LOGOUT KHI TOKEN HẾT HẠN (401)
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          handleLogout(); // Backend báo 401 là tự động đá ra ngoài
        }
        return Promise.reject(error);
      },
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} onBack={() => {}} />;
  }

  return (
    <BrowserRouter>
      <AdminDashboard onLogout={handleLogout} />
    </BrowserRouter>
  );
}
