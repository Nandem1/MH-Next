// /hooks/useUsuariosFull.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsuariosFull, UsuarioFull } from "@/services/usuarioService";
import { useAuth } from "@/hooks/useAuth";

export const useUsuariosFull = () => {
  const { isAuthenticated, status } = useAuth();

  const {
    data: usuarios = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<UsuarioFull[], Error>({
    queryKey: ["usuariosFull"],
    queryFn: getUsuariosFull,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: isAuthenticated, // Usar isAuthenticated en lugar de status
  });

  return {
    usuarios,
    isLoading: isLoading || status === "loading",
    isError,
    refetch,
  };
};
