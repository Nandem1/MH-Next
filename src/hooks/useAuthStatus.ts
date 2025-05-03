"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  id?: number;
  usuario_id?: number | null;
  rol_id?: number;
}

export const useAuthStatus = (): AuthStatus => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState<number | undefined>(undefined);
  const [usuario_id, setUsuarioId] = useState<number | null>(null);
  const [rol_id, setRolId] = useState<number | undefined>(undefined);

  useEffect(() => {
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
        console.error("No autenticado:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading, id, usuario_id, rol_id };
};