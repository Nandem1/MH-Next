"use client";

// /hooks/useCategorias.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  Categoria,
  CreateCategoriaRequest,
  UpdateCategoriaRequest,
} from "@/services/categoriaService";

export const useCategorias = () => {
  const {
    data: categorias = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Categoria[], Error>({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    categorias,
    isLoading,
    isError,
    refetch,
  };
};

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoriaRequest) => createCategoria(data),
    onSuccess: () => {
      // Invalidar caché para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });
};

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateCategoriaRequest;
    }) => updateCategoria(id, data),
    onSuccess: () => {
      // Invalidar caché para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });
};

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategoria(id),
    onSuccess: () => {
      // Invalidar caché para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });
};

