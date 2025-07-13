"use client";

// /hooks/useUsuariosFull.ts


import { useQuery } from "@tanstack/react-query";
import { getUsuariosFull, UsuarioFull } from "@/services/usuarioService";

export const useUsuariosFull = () => {
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
  });

  return {
    usuarios,
    isLoading,
    isError,
    refetch,
  };
};
