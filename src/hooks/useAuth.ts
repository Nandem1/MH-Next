// src/hooks/useAuth.ts
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import {
  login as loginService,
  logout as logoutService,
  getUsuarioAutenticado,
  UsuarioAuth,
} from "@/services/authService";

interface LoginResult {
  success: boolean;
  message: string;
}

// -------------------------------------------------- helpers
const setAuthHeader = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

const saveLocalAuth = (user: UsuarioAuth | null, token: string | null) => {
  if (user) {
    localStorage.setItem("usuario", JSON.stringify(user));
  } else {
    localStorage.removeItem("usuario");
  }

  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
  setAuthHeader(token);
};

// -------------------------------------------------- hook
export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);

  // ------------------------ loadUsuario (useCallback para deps)
  const loadUsuario = useCallback(async () => {
    try {
      const { user } = await getUsuarioAutenticado();
      setUsuario(user);
      localStorage.setItem("usuario", JSON.stringify(user));
    } catch (err) {
      console.error("No se pudo cargar el usuario:", err);
      saveLocalAuth(null, null);
    }
  }, []);

  // ------------------------ init
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("usuario");
    if (storedToken) setAuthHeader(storedToken);
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    } else if (storedToken) {
      loadUsuario();
    }
  }, [loadUsuario]);

  // ------------------------ actions
  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    setLoading(true);
    try {
      const { token, user } = await loginService(email, password);
      saveLocalAuth(user, token);
      localStorage.setItem("showLoginMessage", "true");
      router.push("/dashboard/inicio");
      return { success: true, message: "Inicio de sesión exitoso." };
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message ?? "Error desconocido";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (err) {
      console.error("Error cerrando sesión:", err);
    } finally {
      saveLocalAuth(null, null);
      localStorage.setItem("showLogoutMessage", "true");
      router.push("/login");
    }
  };

  return { login, logout, loading, usuario, loadUsuario };
};
