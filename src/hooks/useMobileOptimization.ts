import { useEffect } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { useQueryClient } from '@tanstack/react-query';

export function useMobileOptimization() {
  const isMobile = useResponsive("(max-width: 768px)");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isMobile) {
      // En mobile, reducir el staleTime para datos más frescos
      // pero con cache más agresivo
      queryClient.setDefaultOptions({
        queries: {
          staleTime: 30 * 1000, // 30 segundos en mobile
          gcTime: 5 * 60 * 1000, // 5 minutos en memoria
          retry: 1, // Menos reintentos en mobile
          refetchOnWindowFocus: false, // No refetch al enfocar ventana
        },
      });
    } else {
      // En desktop, mantener configuración normal
      queryClient.setDefaultOptions({
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutos en desktop
          gcTime: 10 * 60 * 1000, // 10 minutos en memoria
          retry: 3,
          refetchOnWindowFocus: true,
        },
      });
    }
  }, [isMobile, queryClient]);

  // Función para prefetch optimizado en mobile
  const prefetchMobile = (queryKey: unknown[], queryFn: () => Promise<unknown>) => {
    if (isMobile) {
      // En mobile, prefetch con menor prioridad
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
      });
    }
  };

  return {
    isMobile,
    prefetchMobile,
  };
} 