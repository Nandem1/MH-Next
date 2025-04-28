// /hooks/useAuth.ts
"use client";

import { useRouter } from "next/navigation";
import { login as loginService, logout as logoutService } from "@/services/authService"; // 👈 Importamos logout también
import { useSnackbar } from "@/hooks/useSnackbar";
import { useState } from "react";

export const useAuth = () => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      await loginService(email, password);

      // Guardar marca en localStorage para mostrar mensaje en /dashboard/inicio
      localStorage.setItem("showLoginMessage", "true");

      router.push("/dashboard/inicio");
    } catch (error) {
      console.error("Error en login:", error);
      showSnackbar("Email o contraseña incorrectos", "error");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      localStorage.setItem("showLogoutMessage", "true"); // Para mostrar snackbar de "sesión cerrada"
      router.push("/login");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return { login, logout, loading };
};
