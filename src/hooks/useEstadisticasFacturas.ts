// src/hooks/useEstadisticasFacturas.ts

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { estadisticasFacturasService } from '@/services/estadisticasFacturasService';
import { UseEstadisticasFacturasReturn } from '@/types/estadisticasFacturas';

export const useEstadisticasFacturas = (): UseEstadisticasFacturasReturn => {
  const queryClient = useQueryClient();
  
  const {
    data: estadisticas,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['estadisticas-facturas'],
    queryFn: () => estadisticasFacturasService.getEstadisticasFacturas(),
    staleTime: 2 * 60 * 1000, // 2 minutos (más fresco)
    refetchInterval: 5 * 60 * 1000, // Refetch cada 5 minutos (más frecuente)
    refetchIntervalInBackground: true, // Refetch incluso cuando la pestaña no está activa
    refetchOnWindowFocus: true, // Refetch cuando el usuario vuelve a la pestaña
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Función para invalidar estadísticas cuando cambien los datos
  const invalidarEstadisticas = () => {
    queryClient.invalidateQueries({ queryKey: ['estadisticas-facturas'] });
  };

  return {
    estadisticas: estadisticas || null,
    loading,
    error: error ? (error as Error).message : null,
    refetch: () => refetch(),
    invalidarEstadisticas,
  };
};
