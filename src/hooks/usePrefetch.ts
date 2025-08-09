import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export function usePrefetch() {
  const queryClient = useQueryClient();

  // Prefetch de facturas cuando el usuario está en el dashboard
  const prefetchFacturas = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['facturas', 1, 10, '', '', '', ''],
      queryFn: async () => {
        // Importar dinámicamente para no aumentar el bundle inicial
        const { getFacturas } = await import('@/services/facturaService');
        return getFacturas(1, 10, '', '', '', '');
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
    });
  }, [queryClient]);

  // Prefetch de notas de crédito
  const prefetchNotasCredito = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['notasCredito', 1, 10, '', '', ''],
      queryFn: async () => {
        const { getNotasCredito } = await import('@/services/notaCreditoService');
        return getNotasCredito(1, 10, '', '', '');
      },
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  // Prefetch de usuarios (datos que se usan en filtros)
  const prefetchUsuarios = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['usuarios'],
      queryFn: async () => {
        const { getUsuarios } = await import('@/services/usuarioService');
        return getUsuarios();
      },
      staleTime: 10 * 60 * 1000, // 10 minutos para datos que cambian menos
    });
  }, [queryClient]);

  // Prefetch de proveedores
  const prefetchProveedores = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['proveedores'],
      queryFn: async () => {
        const { getProveedores } = await import('@/services/usuarioService');
        return getProveedores();
      },
      staleTime: 10 * 60 * 1000,
    });
  }, [queryClient]);

  // Prefetch de datos de cartelería (la página más pesada)
  const prefetchCarteleria = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['auditoria-carteleria'],
      queryFn: async () => {
        const { carteleriaService } = await import('@/services/carteleriaService');
        return carteleriaService.getAuditoriaCarteleria();
      },
      staleTime: 2 * 60 * 1000, // 2 minutos para datos que cambian más
    });
  }, [queryClient]);

  return {
    prefetchFacturas,
    prefetchNotasCredito,
    prefetchUsuarios,
    prefetchProveedores,
    prefetchCarteleria,
  };
} 