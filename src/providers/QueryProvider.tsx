'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

// Configuración optimizada de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos"
      staleTime: 5 * 60 * 1000, // 5 minutos
      
      // Tiempo que los datos se mantienen en cache
      gcTime: 10 * 60 * 1000, // 10 minutos (antes llamado cacheTime)
      
      // Reintentos en caso de error
      retry: (failureCount, error: unknown) => {
        // No reintentar en errores 4xx (excepto 408, 429)
        const errorStatus = (error as { status?: number })?.status;
        if (errorStatus && errorStatus >= 400 && errorStatus < 500 && ![408, 429].includes(errorStatus)) {
          return false;
        }
        // Máximo 3 reintentos
        return failureCount < 3;
      },
      
      // Reintentar después de un delay exponencial
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // No refetch automático al enfocar la ventana
      refetchOnWindowFocus: false,
      
      // No refetch automático al reconectar
      refetchOnReconnect: false,
      
      // Refetch automático cuando la ventana vuelve a estar visible
      refetchOnMount: true,
    },
    mutations: {
      // Reintentos para mutaciones
      retry: 1,
      
      // Retry delay para mutaciones
      retryDelay: 1000,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
