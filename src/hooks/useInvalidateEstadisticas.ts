// src/hooks/useInvalidateEstadisticas.ts

import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook para invalidar las estadísticas de facturas cuando cambien los datos
 * Úsalo en cualquier componente que modifique facturas, cheques, o nóminas
 */
export const useInvalidateEstadisticas = () => {
  const queryClient = useQueryClient();

  const invalidarEstadisticasFacturas = () => {
    // Invalidar estadísticas de facturas
    queryClient.invalidateQueries({ queryKey: ['estadisticas-facturas'] });
  };

  const invalidarTodo = () => {
    // Invalidar estadísticas y datos relacionados
    queryClient.invalidateQueries({ queryKey: ['estadisticas-facturas'] });
    queryClient.invalidateQueries({ queryKey: ['facturas'] });
    queryClient.invalidateQueries({ queryKey: ['nominas'] });
    queryClient.invalidateQueries({ queryKey: ['cheques'] });
  };

  return {
    invalidarEstadisticasFacturas,
    invalidarTodo,
  };
};

