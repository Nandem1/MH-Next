"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { gastosService, CrearGastoRequest } from '../services/gastosService';

export const useGastos = () => {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  // Query para obtener gastos
  const {
    data: gastosData,
    isLoading: loading,
    error: errorGastos,
    refetch: fetchGastos
  } = useQuery({
    queryKey: ['gastos', usuario?.usuario_id],
    queryFn: () => gastosService.obtenerGastos(),
    enabled: !!usuario?.usuario_id,
    staleTime: 30000, // 30 segundos
  });

  // Mutation para crear gasto
  const crearGastoMutation = useMutation({
    mutationFn: (gastoData: CrearGastoRequest) => gastosService.crearGasto(gastoData),
    onSuccess: () => {
      // Invalidar solo las queries de gastos para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-monetarias'] });
    },
  });

  // Mutation para eliminar gasto
  const eliminarGastoMutation = useMutation({
    mutationFn: (id: string) => gastosService.eliminarGasto(id),
    onSuccess: () => {
      // Invalidar solo las queries de gastos para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-monetarias'] });
    },
  });

  return {
    gastos: gastosData?.data || [],
    loading,
    error: errorGastos,
    fetchGastos,
    crearGasto: crearGastoMutation.mutateAsync,
    eliminarGasto: eliminarGastoMutation.mutateAsync,
  };
};
