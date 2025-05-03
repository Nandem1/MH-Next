// src/hooks/useAuth.ts
"use client";

import { useRouter } from "next/navigation";
import {
  login as loginService,
  logout as logoutService,
  getUsuarioAutenticado,
} from "@/services/authService";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

interface LoginResult {
  success: boolean;
  message: string;
}

interface UsuarioAuth {
  id_auth_user: number;
  email: string;
  usuario_id: number | null;
  rol_id: number;
  nombre: string | null;
  whatsapp_id: string | null;
  id_local: number | null;
}

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);

  useEffect(() => {
    // Cargar usuario desde localStorage si existe
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    } else {
      loadUsuario(); // fallback por si no está en localStorage
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    setLoading(true);

    try {
      const response = await loginService(email, password);
      const user: UsuarioAuth = response.user;
      setUsuario(user);
      localStorage.setItem("usuario", JSON.stringify(user));

      localStorage.setItem("showLoginMessage", "true");
      router.push("/dashboard/inicio");

      return { success: true, message: "Inicio de sesión exitoso." };
    } catch (error) {
      let message = "Error desconocido";

      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      }

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUsuario(null);
      localStorage.removeItem("usuario");
      localStorage.setItem("showLogoutMessage", "true");
      router.push("/login");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  const loadUsuario = async () => {
    try {
      const response = await getUsuarioAutenticado();
      setUsuario(response.user);
      localStorage.setItem("usuario", JSON.stringify(response.user));
    } catch (error) {
      console.error("No se pudo cargar el usuario:", error);
    }
  };

  return { login, logout, loading, usuario, loadUsuario };
};
