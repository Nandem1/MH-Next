import { useState, useCallback, useEffect } from 'react';
import { rindeGastosService, Gasto, EstadoGasto } from '../services/rindeGastosService';

export interface UseRindeGastosOptions {
  fondoFijoInicial?: number;
  autoLoad?: boolean;
}

export interface UseRindeGastosReturn {
  // Estado
  gastos: Gasto[];
  loading: boolean;
  error: string | null;
  
  // Métricas calculadas
  totalGastos: number;
  saldoActual: number;
  
  // Acciones
  agregarGasto: (gasto: Omit<Gasto, 'id' | 'fechaCreacion' | 'estado'>) => Promise<void>;
  eliminarGasto: (id: string) => Promise<void>;
  limpiarError: () => void;
  
  // Utilidades
  formatearMonto: (monto: number) => string;
  obtenerEstadisticasPorCategoria: () => Array<{
    categoria: string;
    total: number;
    cantidad: number;
    porcentaje: number;
  }>;
}

export function useRindeGastos(options: UseRindeGastosOptions = {}): UseRindeGastosReturn {
  const { fondoFijoInicial = 1000000, autoLoad = true } = options;
  
  // Estado principal
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Métricas calculadas (solo gastos aprobados cuentan para el saldo)
  const gastosAprobados = gastos.filter(g => g.estado === 'aprobado');
  const totalGastos = gastosAprobados.reduce((sum, gasto) => sum + gasto.monto, 0);
  const saldoActual = fondoFijoInicial - totalGastos;
  
  // Cargar gastos
  const cargarGastos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const gastosData = await rindeGastosService.obtenerGastos();
      setGastos(gastosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando gastos');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Agregar gasto
  const agregarGasto = useCallback(async (gastoData: Omit<Gasto, 'id' | 'fechaCreacion' | 'estado'>) => {
    try {
      setLoading(true);
      setError(null);
      const nuevoGasto = await rindeGastosService.crearGasto(gastoData);
      setGastos(prev => [nuevoGasto, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando gasto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Método eliminado para simplificar
  
  // Eliminar gasto
  const eliminarGasto = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await rindeGastosService.eliminarGasto(id);
      setGastos(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando gasto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Métodos eliminados para simplificar
  
  // Limpiar error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);
  
  // Formatear monto
  const formatearMonto = useCallback((monto: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(monto);
  }, []);
  
  // Método eliminado para simplificar
  
  // Obtener estadísticas monetarias por categoría
  const obtenerEstadisticasPorCategoria = useCallback(() => {
    const categorias = new Map<string, { total: number; cantidad: number }>();
    
    gastosAprobados.forEach(gasto => {
      const categoria = gasto.categoria || 'Sin categoría';
      const actual = categorias.get(categoria) || { total: 0, cantidad: 0 };
      categorias.set(categoria, {
        total: actual.total + gasto.monto,
        cantidad: actual.cantidad + 1
      });
    });
    
    return Array.from(categorias.entries()).map(([categoria, datos]) => ({
      categoria,
      total: datos.total,
      cantidad: datos.cantidad,
      porcentaje: totalGastos > 0 ? (datos.total / totalGastos) * 100 : 0
    })).sort((a, b) => b.total - a.total);
  }, [gastosAprobados, totalGastos]);
  
  // Cargar datos iniciales
  useEffect(() => {
    if (autoLoad) {
      cargarGastos();
    }
  }, [autoLoad, cargarGastos]);
  
  return {
    // Estado
    gastos,
    loading,
    error,
    
    // Métricas
    totalGastos,
    saldoActual,
    
    // Acciones
    agregarGasto,
    eliminarGasto,
    limpiarError,
    
    // Utilidades
    formatearMonto,
    obtenerEstadisticasPorCategoria,
  };
}
