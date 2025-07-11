import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vencimientosEstadosService } from '@/services/vencimientosEstadosService';
import { ActualizarEstadoVencimientoRequest } from '@/types/vencimientos';

export function useVencimientosEstados() {
  const queryClient = useQueryClient();

  // Mutación para actualizar estado
  const actualizarEstadoMutation = useMutation({
    mutationFn: (request: ActualizarEstadoVencimientoRequest) => {
      return vencimientosEstadosService.actualizarEstado(request);
    },
    onSuccess: () => {
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['control-vencimientos'] });
      queryClient.invalidateQueries({ queryKey: ['vencimientos-estados'] });
      // Invalidar queries de estadísticas para que se actualicen
      queryClient.invalidateQueries({ queryKey: ['vencimientos-estados-estadisticas'] });
      queryClient.invalidateQueries({ queryKey: ['vencimientos-estados-estadisticas-nuevo'] });
    },
    onError: (error) => {
      console.error('Error en mutación de estados:', error);
    },
  });

  return {
    actualizarEstado: actualizarEstadoMutation.mutate,
    actualizarEstadoAsync: actualizarEstadoMutation.mutateAsync,
    isActualizando: actualizarEstadoMutation.isPending,
    errorActualizacion: actualizarEstadoMutation.error,
  };
}

export function useHistorialEstados(vencimientoId: number) {
  return useQuery({
    queryKey: ['vencimientos-estados', vencimientoId],
    queryFn: () => vencimientosEstadosService.obtenerHistorialEstados(vencimientoId),
    enabled: !!vencimientoId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useEstadoActual(vencimientoId: number) {
  return useQuery({
    queryKey: ['vencimientos-estado-actual', vencimientoId],
    queryFn: () => vencimientosEstadosService.obtenerEstadoActual(vencimientoId),
    enabled: !!vencimientoId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

export function useEstadisticasEstados() {
  return useQuery({
    queryKey: ['vencimientos-estados-estadisticas'],
    queryFn: () => vencimientosEstadosService.obtenerEstadisticasEstados(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useEstadisticasEstadosVencimientos() {
  return useQuery({
    queryKey: ['vencimientos-estados-estadisticas-nuevo'],
    queryFn: () => vencimientosEstadosService.obtenerEstadisticasEstadosVencimientos(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useStockDisponible(vencimientoId: number) {
  return useQuery({
    queryKey: ['vencimientos-stock-disponible', vencimientoId],
    queryFn: () => vencimientosEstadosService.obtenerStockDisponible(vencimientoId),
    enabled: !!vencimientoId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
} 