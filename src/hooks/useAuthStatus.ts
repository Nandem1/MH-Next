"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  id?: number;
  usuario_id?: number | null;
  rol_id?: number;
}

const clearAuthData = () => {
  // Limpiar localStorage
  localStorage.removeItem("authToken");
  localStorage.removeItem("usuario");
  
  // Limpiar cookies
  document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  // Limpiar headers de axios
  delete axios.defaults.headers.common["Authorization"];
};

export const useAuthStatus = (): AuthStatus => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState<number | undefined>();
  const [usuario_id, setUsuarioId] = useState<number | null>(null);
  const [rol_id, setRolId] = useState<number | undefined>();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api-beta/me`, {
          withCredentials: true,
        });
        const user = data.user;
        setIsAuthenticated(true);
        setId(user.id_auth_user);
        setUsuarioId(user.usuario_id);
        setRolId(user.rol_id);
      } catch (error) {
        const axiosError = error as AxiosError;
        // Si es error 403 o cualquier otro error de autenticación
        if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
          clearAuthData();
          setIsAuthenticated(false);
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, isLoading, id, usuario_id, rol_id };
};
