"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Usuario {
  id_auth_user: number;
  usuario_id: number | null;
  rol_id: number;
  nombre: string;
  email: string;
  local_id: number;
  local_nombre: string;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  usuario?: Usuario;
  id?: number;
  usuario_id?: number | null;
  rol_id?: number;
}

export const locales = [
  { id: 1, nombre: "LA CANTERA 3055" },
  { id: 2, nombre: "LIBERTADOR 1476" },
  { id: 3, nombre: "BALMACEDA 599" },
];

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
  const [usuario, setUsuario] = useState<Usuario | undefined>();
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
        
        // Crear objeto usuario completo
        const usuarioCompleto: Usuario = {
          id_auth_user: user.id_auth_user,
          usuario_id: user.usuario_id,
          rol_id: user.rol_id,
          nombre: user.nombre || user.name || "Usuario",
          email: user.email || "",
          local_id: user.id_local || 1,
          local_nombre: user.local_nombre || "LA CANTERA 3055",
        };
        
        setIsAuthenticated(true);
        setUsuario(usuarioCompleto);
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

  return { isAuthenticated, isLoading, usuario, id, usuario_id, rol_id };
};
