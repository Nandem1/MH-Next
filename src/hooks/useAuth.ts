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
import { useSession } from "next-auth/react";

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
    localStorage.setItem("user_data", JSON.stringify(user));
  } else {
    localStorage.removeItem("usuario");
    localStorage.removeItem("user_data");
  }

  if (token) {
    localStorage.setItem("authToken", token);
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("authToken");
    localStorage.removeItem("auth_token");
  }
  setAuthHeader(token);
};

// -------------------------------------------------- hook
export const useAuth = () => {
  const { data: session, status } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);

  // ------------------------ loadUsuario (useCallback para deps)
  const loadUsuario = useCallback(async () => {
    try {
      const { user } = await getUsuarioAutenticado();
      setUsuario(user);
      localStorage.setItem("usuario", JSON.stringify(user));
      localStorage.setItem("user_data", JSON.stringify(user));
    } catch {
      saveLocalAuth(null, null);
    }
  }, []);

  // ------------------------ init
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken") || localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("usuario") || localStorage.getItem("user_data");
    if (storedToken) setAuthHeader(storedToken);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsuario(parsedUser);
      } catch {
        saveLocalAuth(null, null);
      }
    } else if (storedToken) {
      loadUsuario();
    }
  }, [loadUsuario]);

  useEffect(() => {
    // Detectar si es dispositivo móvil
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileRegex.test(userAgent.toLowerCase()));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    } catch {
      // Silenciosamente manejar el error
    } finally {
      saveLocalAuth(null, null);
      localStorage.setItem("showLogoutMessage", "true");
      router.push("/login");
    }
  };

  const isAuthenticated = () => {
    if (isMobile) {
      // En móvil, verificar localStorage
      const token = localStorage.getItem('authToken') || localStorage.getItem('auth_token');
      return !!token;
    }
    // En desktop, usar la sesión de NextAuth
    return status === 'authenticated';
  };

  const getToken = () => {
    if (isMobile) {
      return localStorage.getItem('authToken') || localStorage.getItem('auth_token');
    }
    return session?.user?.id;
  };

  const getUserRole = () => {
    if (isMobile) {
      const userData = localStorage.getItem('usuario') || localStorage.getItem('user_data');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          return parsed.rol_id?.toString();
        } catch {
          return null;
        }
      }
      return null;
    }
    return session?.user?.role;
  };

  const isAdmin = () => {
    const role = getUserRole();
    return role === "1";
  };

  return {
    login,
    logout,
    loading,
    usuario,
    loadUsuario,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    status,
    session,
    isMobile,
    getToken,
    getUserRole
  };
};
