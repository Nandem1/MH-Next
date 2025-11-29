"use client";

// /hooks/useUsuariosAutorizados.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsuariosAutorizados,
  createUsuarioAutorizado,
  updateUsuarioAutorizado,
  UsuarioAutorizado,
  CreateUsuarioAutorizadoRequest,
  UpdateUsuarioAutorizadoRequest,
} from "@/services/usuarioService";

export const useUsuariosAutorizados = () => {
  const {
    data: usuarios = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<UsuarioAutorizado[], Error>({
    queryKey: ["usuariosAutorizados"],
    queryFn: getUsuariosAutorizados,
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

export const useCreateUsuarioAutorizado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUsuarioAutorizadoRequest) =>
      createUsuarioAutorizado(data),
    onSuccess: () => {
      // Invalidar caché para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["usuariosAutorizados"] });
    },
  });
};

export const useUpdateUsuarioAutorizado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateUsuarioAutorizadoRequest;
    }) => updateUsuarioAutorizado(id, data),
    onSuccess: () => {
      // Invalidar caché para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["usuariosAutorizados"] });
    },
  });
};

