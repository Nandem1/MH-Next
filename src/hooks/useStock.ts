import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import stockService from '@/services/stockService';
import {
  StockEntradaMultipleRequest,
  StockSalidaMultipleRequest,
} from '@/types/stock';
import { useSnackbar } from './useSnackbar';

export const useStock = (idLocal?: number) => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  // 📦 Entrada Múltiple de Stock (Backend Go) - USADO EN NUEVO MOVIMIENTO
  const entradaMultipleMutation = useMutation({
    mutationFn: (data: StockEntradaMultipleRequest) => stockService.entradaMultiple(data),
    onSuccess: (response) => {
      if (response.success) {
        showSnackbar('✅ Entrada múltiple registrada correctamente', 'success');
        // Invalidar cache de stock para actualizar Stock General
        queryClient.invalidateQueries({ queryKey: ['stockLocalCompleto'] });
      } else {
        showSnackbar('❌ Error en entrada múltiple', 'error');
      }
    },
    onError: (error) => {
      console.error('Error en entrada múltiple:', error);
      showSnackbar('❌ Error al procesar entrada múltiple', 'error');
    }
  });

  // 🛒 Salida Múltiple de Stock (Backend Go) - USADO EN NUEVO MOVIMIENTO
  const salidaMultipleMutation = useMutation({
    mutationFn: (data: StockSalidaMultipleRequest) => stockService.salidaMultiple(data),
    onSuccess: (response) => {
      if (response.success) {
        showSnackbar('✅ Salida múltiple registrada correctamente', 'success');
        // Invalidar cache de stock para actualizar Stock General
        queryClient.invalidateQueries({ queryKey: ['stockLocalCompleto'] });
      } else {
        showSnackbar('❌ Error en salida múltiple', 'error');
      }
    },
    onError: (error) => {
      console.error('Error en salida múltiple:', error);
      showSnackbar('❌ Error al procesar salida múltiple', 'error');
    }
  });

  // 📊 Stock Local Completo (Backend Go) - USADO EN STOCK GENERAL
  const stockLocalCompletoQuery = useQuery({
    queryKey: ['stockLocalCompleto', idLocal],
    queryFn: () => stockService.getStockLocalCompleto(idLocal || 1),
    enabled: !!idLocal,
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });

  return {
    // Mutations para Nuevo Movimiento
    entradaMultiple: entradaMultipleMutation.mutate,
    salidaMultiple: salidaMultipleMutation.mutate,

    // Loading states para Nuevo Movimiento
    loadingEntradaMultiple: entradaMultipleMutation.isPending,
    loadingSalidaMultiple: salidaMultipleMutation.isPending,

    // Mutation states para Nuevo Movimiento
    isEntradaMultipleLoading: entradaMultipleMutation.isPending,
    isSalidaMultipleLoading: salidaMultipleMutation.isPending,

    // Query para Stock General
    stockLocalCompleto: stockLocalCompletoQuery.data,
    loadingStockLocalCompleto: stockLocalCompletoQuery.isLoading,
    errorStockLocalCompleto: stockLocalCompletoQuery.error,
    refetchStockLocalCompleto: stockLocalCompletoQuery.refetch,
  };
}; 