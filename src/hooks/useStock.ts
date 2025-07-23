import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import stockService from '@/services/stockService';
import {
  StockEntradaMultipleRequest,
  StockSalidaMultipleRequest,
  StockEntradaRequest,
  StockSalidaRequest,
} from '@/types/stock';
import { useSnackbar } from './useSnackbar';

export const useStock = (idLocal: number = 1) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // 📊 Consultar Stock por Local (Backend Go)
  const {
    data: stockLocal,
    isLoading: loadingStock,
    error: errorStock,
    refetch: refetchStock
  } = useQuery({
    queryKey: ['stock', 'local', idLocal],
    queryFn: () => stockService.getStockLocal(idLocal),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // ⚠️ Productos con Stock Bajo (Backend Go) - TEMPORALMENTE DESHABILITADO
  const {
    data: stockBajo,
    isLoading: loadingStockBajo,
    error: errorStockBajo,
    refetch: refetchStockBajo
  } = useQuery({
    queryKey: ['stock', 'bajo', idLocal],
    queryFn: () => stockService.getStockBajo(idLocal),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    enabled: false, // TEMPORALMENTE DESHABILITADO
  });

  // 📈 Historial de Movimientos (Backend Go) - TEMPORALMENTE DESHABILITADO
  const {
    data: movimientos,
    isLoading: loadingMovimientos,
    error: errorMovimientos,
    refetch: refetchMovimientos
  } = useQuery({
    queryKey: ['stock', 'movimientos', idLocal],
    queryFn: () => stockService.getMovimientos(idLocal),
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
    enabled: false, // TEMPORALMENTE DESHABILITADO
  });

  // 📋 Reporte Completo de Stock (Backend Go) - TEMPORALMENTE DESHABILITADO
  const {
    data: reporteStock,
    isLoading: loadingReporte,
    error: errorReporte,
    refetch: refetchReporte
  } = useQuery({
    queryKey: ['stock', 'reporte', idLocal],
    queryFn: () => stockService.getReporteStock(idLocal),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    enabled: false, // TEMPORALMENTE DESHABILITADO
  });

  // 🚀 Búsqueda Rápida de Producto por Código de Barras (POS)
  const buscarProductoMutation = useMutation({
    mutationFn: (barcode: string) => stockService.getProductoByBarcode(barcode),
    onError: (error) => {
      console.error('Error buscando producto:', error);
    }
  });

  // 📦 Entrada Múltiple de Stock (Backend Go)
  const entradaMultipleMutation = useMutation({
    mutationFn: (data: StockEntradaMultipleRequest) => stockService.entradaMultiple(data),
    onSuccess: (response) => {
      if (response.success) {
        showSnackbar('✅ Entrada múltiple registrada correctamente', 'success');
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['stock', 'local', idLocal] });
        queryClient.invalidateQueries({ queryKey: ['stock', 'bajo', idLocal] });
        queryClient.invalidateQueries({ queryKey: ['stock', 'movimientos', idLocal] });
        queryClient.invalidateQueries({ queryKey: ['stock', 'reporte', idLocal] });
      } else {
        showSnackbar('❌ Error en entrada múltiple', 'error');
      }
    },
    onError: (error) => {
      console.error('Error en entrada múltiple:', error);
      showSnackbar('❌ Error al procesar entrada múltiple', 'error');
    }
  });

  // 🛒 Salida Múltiple de Stock (Backend Go)
  const salidaMultipleMutation = useMutation({
    mutationFn: (data: StockSalidaMultipleRequest) => stockService.salidaMultiple(data),
    onSuccess: (response) => {
      if (response.success) {
        showSnackbar('✅ Salida múltiple registrada correctamente', 'success');
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['stock', 'local', idLocal] });
        queryClient.invalidateQueries({ queryKey: ['stock', 'bajo', idLocal] });
        queryClient.invalidateQueries({ queryKey: ['stock', 'movimientos', idLocal] });
        queryClient.invalidateQueries({ queryKey: ['stock', 'reporte', idLocal] });
      } else {
        showSnackbar('❌ Error en salida múltiple', 'error');
      }
    },
    onError: (error) => {
      console.error('Error en salida múltiple:', error);
      showSnackbar('❌ Error al procesar salida múltiple', 'error');
    }
  });

  // 📦 Entrada Individual de Stock
  const entradaIndividualMutation = useMutation({
    mutationFn: (data: StockEntradaRequest) => stockService.entradaIndividual(data),
    onSuccess: (response) => {
      if (response.success) {
        showSnackbar('✅ Entrada individual registrada correctamente', 'success');
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['stock', 'local', idLocal] });
        queryClient.invalidateQueries({ queryKey: ['stock', 'bajo', idLocal] });
        queryClient.invalidateQueries({ queryKey: ['stock', 'movimientos', idLocal] });
        queryClient.invalidateQueries({ queryKey: ['stock', 'reporte', idLocal] });
      } else {
        showSnackbar('❌ Error en entrada individual', 'error');
      }
    },
    onError: (error) => {
      console.error('Error en entrada individual:', error);
      showSnackbar('❌ Error al procesar entrada individual', 'error');
    }
  });

  // 📤 Salida Individual de Stock
  const salidaIndividualMutation = useMutation({
    mutationFn: (data: StockSalidaRequest) => stockService.salidaIndividual(data),
    onSuccess: (response) => {
      if (response.success) {
        showSnackbar('✅ Salida individual registrada correctamente', 'success');
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['stock', 'local', idLocal] });
        queryClient.invalidateQueries({ queryKey: ['stock', 'bajo', idLocal] });
        queryClient.invalidateQueries({ queryKey: ['stock', 'movimientos', idLocal] });
        queryClient.invalidateQueries({ queryKey: ['stock', 'reporte', idLocal] });
      } else {
        showSnackbar('❌ Error en salida individual', 'error');
      }
    },
    onError: (error) => {
      console.error('Error en salida individual:', error);
      showSnackbar('❌ Error al procesar salida individual', 'error');
    }
  });

  // 🔄 Refrescar todos los datos
  const refreshAllData = () => {
    refetchStock();
    refetchStockBajo();
    refetchMovimientos();
    refetchReporte();
  };

  // 📊 Estadísticas rápidas
  const stats = useMemo(() => ({
    totalProductos: stockLocal?.data?.length || 0,
    productosStockBajo: stockBajo?.data?.length || 0,
    movimientosRecientes: movimientos?.data?.length || 0,
    valorTotalEstimado: reporteStock?.data?.resumen?.valor_total_estimado || 0,
  }), [stockLocal?.data?.length, stockBajo?.data?.length, movimientos?.data?.length, reporteStock?.data?.resumen?.valor_total_estimado]);

  return {
    // Data
    stockLocal: stockLocal?.data || [],
    stockBajo: stockBajo?.data || [],
    movimientos: movimientos?.data || [],
    reporteStock: reporteStock?.data,
    stats,

    // Loading states
    loadingStock,
    loadingStockBajo,
    loadingMovimientos,
    loadingReporte,
    loadingEntradaMultiple: entradaMultipleMutation.isPending,
    loadingSalidaMultiple: salidaMultipleMutation.isPending,
    loadingEntradaIndividual: entradaIndividualMutation.isPending,
    loadingSalidaIndividual: salidaIndividualMutation.isPending,

    // Error states
    errorStock,
    errorStockBajo,
    errorMovimientos,
    errorReporte,

    // Mutations
    entradaMultiple: entradaMultipleMutation.mutate,
    salidaMultiple: salidaMultipleMutation.mutate,
    entradaIndividual: entradaIndividualMutation.mutate,
    salidaIndividual: salidaIndividualMutation.mutate,
    buscarProducto: buscarProductoMutation.mutate,

    // Refetch functions
    refetchStock,
    refetchStockBajo,
    refetchMovimientos,
    refetchReporte,
    refreshAllData,

    // Mutation states
    isEntradaMultipleLoading: entradaMultipleMutation.isPending,
    isSalidaMultipleLoading: salidaMultipleMutation.isPending,
    isEntradaIndividualLoading: entradaIndividualMutation.isPending,
    isSalidaIndividualLoading: salidaIndividualMutation.isPending,
    isBuscarProductoLoading: buscarProductoMutation.isPending,
  };
};

// Hook específico para movimientos con filtros
export const useMovimientos = (idLocal: number, filtros?: Record<string, unknown>) => {
  const {
    data: movimientos,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['stock', 'movimientos', idLocal, filtros],
    queryFn: () => stockService.getMovimientos(idLocal, filtros),
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    movimientos: movimientos?.data || [],
    totalMovimientos: movimientos?.total_movimientos || 0,
    isLoading,
    error,
    refetch
  };
};

// Hook específico para productos movidos
export const useProductosMovidos = (
  idLocal: number, 
  tipo: 'mas' | 'menos' = 'mas', 
  limit: number = 10
) => {
  const {
    data: productosMovidos,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['stock', 'productos-movidos', idLocal, tipo, limit],
    queryFn: () => stockService.getProductosMovidos(idLocal, tipo, limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  return {
    productosMovidos: productosMovidos?.data || [],
    totalProductos: productosMovidos?.total_productos || 0,
    tipoConsulta: productosMovidos?.tipo_consulta,
    isLoading,
    error,
    refetch
  };
};

// Hook para consultar stock de un producto específico
export const useStockProducto = (codigoProducto: string, idLocal: number) => {
  const {
    data: stockProducto,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['stock', 'producto', codigoProducto, idLocal],
    queryFn: () => stockService.getStockProducto(codigoProducto, idLocal),
    enabled: !!codigoProducto && !!idLocal,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    stockProducto: stockProducto?.data,
    isLoading,
    error,
    refetch
  };
}; 