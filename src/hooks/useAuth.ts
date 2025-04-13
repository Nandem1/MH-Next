"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(loggedIn);
  }, []);

  const login = (email: string, password: string) => {
    if (email && password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("showLoginMessage", "true"); // ✅ Nueva marca
      setIsAuthenticated(true);
      router.push("/dashboard/inicio");
    }
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.setItem("showLogoutMessage", "true"); // ✅ Guardamos marca
    setIsAuthenticated(false);
    router.push("/login");
  };

  return { isAuthenticated, login, logout };
}
