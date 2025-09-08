// /hooks/useCajaChicaUsuarios.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsuariosCajaChica,
  habilitarCajaChica,
  editarCajaChica,
  deshabilitarCajaChica,
  UsuarioCajaChica,
  HabilitarCajaChicaRequest,
  EditarCajaChicaRequest,
  DeshabilitarCajaChicaRequest,
} from "@/services/cajaChicaService";

export const useCajaChicaUsuarios = () => {
  const queryClient = useQueryClient();

  // Query para obtener usuarios con estado de caja chica
  const {
    data: usuarios = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<UsuarioCajaChica[], Error>({
    queryKey: ["usuariosCajaChica"],
    queryFn: getUsuariosCajaChica,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  // Mutation para habilitar caja chica
  const habilitarMutation = useMutation({
    mutationFn: habilitarCajaChica,
    onSuccess: () => {
      // Invalidar y refetch de la lista de usuarios
      queryClient.invalidateQueries({ queryKey: ["usuariosCajaChica"] });
      queryClient.invalidateQueries({ queryKey: ["usuariosFull"] });
    },
  });

  // Mutation para editar caja chica
  const editarMutation = useMutation({
    mutationFn: editarCajaChica,
    onSuccess: () => {
      // Invalidar y refetch de la lista de usuarios
      queryClient.invalidateQueries({ queryKey: ["usuariosCajaChica"] });
      queryClient.invalidateQueries({ queryKey: ["usuariosFull"] });
    },
  });

  // Mutation para deshabilitar caja chica
  const deshabilitarMutation = useMutation({
    mutationFn: deshabilitarCajaChica,
    onSuccess: () => {
      // Invalidar y refetch de la lista de usuarios
      queryClient.invalidateQueries({ queryKey: ["usuariosCajaChica"] });
      queryClient.invalidateQueries({ queryKey: ["usuariosFull"] });
    },
  });

  // Funciones helper para las operaciones
  const habilitarCajaChicaUsuario = async (request: HabilitarCajaChicaRequest) => {
    return habilitarMutation.mutateAsync(request);
  };

  const editarCajaChicaUsuario = async (request: EditarCajaChicaRequest) => {
    return editarMutation.mutateAsync(request);
  };

  const deshabilitarCajaChicaUsuario = async (request: DeshabilitarCajaChicaRequest) => {
    return deshabilitarMutation.mutateAsync(request);
  };

  return {
    // Datos
    usuarios,
    isLoading,
    isError,
    refetch,

    // Estados de las mutaciones
    isHabilitando: habilitarMutation.isPending,
    isEditando: editarMutation.isPending,
    isDeshabilitando: deshabilitarMutation.isPending,

    // Errores de las mutaciones
    errorHabilitar: habilitarMutation.error,
    errorEditar: editarMutation.error,
    errorDeshabilitar: deshabilitarMutation.error,

    // Funciones
    habilitarCajaChicaUsuario,
    editarCajaChicaUsuario,
    deshabilitarCajaChicaUsuario,

    // Reset de errores
    resetErrorHabilitar: habilitarMutation.reset,
    resetErrorEditar: editarMutation.reset,
    resetErrorDeshabilitar: deshabilitarMutation.reset,
  };
};
