"use client";

import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook para invalidar caché de manera centralizada
 * Asegura que todos los datos relacionados se actualicen correctamente
 */
export const useInvalidateCache = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidar todo el caché relacionado con gastos y caja chica
   */
  const invalidateGastosCache = () => {
    queryClient.invalidateQueries({ queryKey: ['gastos'] });
    queryClient.invalidateQueries({ queryKey: ['caja-chica'] });
    queryClient.invalidateQueries({ queryKey: ['estadisticas-monetarias'] });
    queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica'] });
    queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica-estado'] });
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    queryClient.invalidateQueries({ queryKey: ['usuario'] });
  };

  /**
   * Invalidar caché de caja chica específicamente
   */
  const invalidateCajaChicaCache = () => {
    queryClient.invalidateQueries({ queryKey: ['caja-chica'] });
    queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica'] });
    queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica-estado'] });
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    queryClient.invalidateQueries({ queryKey: ['usuario'] });
  };

  /**
   * Invalidar caché de estadísticas
   */
  const invalidateEstadisticasCache = () => {
    queryClient.invalidateQueries({ queryKey: ['estadisticas-monetarias'] });
    queryClient.invalidateQueries({ queryKey: ['estadisticas'] });
  };

  /**
   * Invalidar todo el caché del sistema
   */
  const invalidateAllCache = () => {
    queryClient.invalidateQueries();
  };

  return {
    invalidateGastosCache,
    invalidateCajaChicaCache,
    invalidateEstadisticasCache,
    invalidateAllCache,
  };
};
