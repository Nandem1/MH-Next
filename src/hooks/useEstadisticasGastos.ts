"use client";

import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { gastosService, EstadisticasResponse } from '../services/gastosService';

export const useEstadisticasGastos = () => {
  const { usuario } = useAuth();

  // Query para obtener estadísticas
  const {
    data: estadisticas,
    isLoading: loading,
    error,
    refetch: cargarEstadisticas
  } = useQuery({
    queryKey: ['estadisticas-monetarias', usuario?.usuario_id],
    queryFn: async () => {
      const data: EstadisticasResponse = await gastosService.obtenerEstadisticas();
      console.log('🔍 DEBUG useEstadisticasGastos - cargarEstadisticas:', { data, categorias: data.data });
      return data.data;
    },
    enabled: !!usuario?.usuario_id,
    staleTime: 60000, // 1 minuto
  });

  return {
    estadisticas: estadisticas || [],
    loading,
    error,
    cargarEstadisticas
  };
};
