import { useState, useEffect, useCallback } from 'react';
import { cuentasContablesService, CuentaContable } from '../services/cuentasContablesService';

export interface UseCuentasContablesOptions {
  autoLoad?: boolean;
  limiteMasUsadas?: number;
}

export interface UseCuentasContablesReturn {
  // Estado
  cuentas: CuentaContable[];
  cuentasMasUsadas: CuentaContable[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  cargarCuentas: () => Promise<void>;
  buscarCuentas: (texto: string) => Promise<CuentaContable[]>;
  obtenerCuentaPorId: (id: string) => CuentaContable | null;
  limpiarError: () => void;
  
  // Utilidades
  agruparPorCategoria: (cuentas: CuentaContable[]) => Record<string, CuentaContable[]>;
  obtenerCuentasPorCategoria: (categoria: string) => CuentaContable[];
}

export function useCuentasContables(options: UseCuentasContablesOptions = {}): UseCuentasContablesReturn {
  const { autoLoad = true } = options;
  
  // Estado
  const [cuentas, setCuentas] = useState<CuentaContable[]>([]);
  const [cuentasMasUsadas, setCuentasMasUsadas] = useState<CuentaContable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar todas las cuentas
  const cargarCuentas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cuentasData = await cuentasContablesService.obtenerCuentasContables();
      setCuentas(cuentasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando cuentas contables');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Cargar cuentas más usadas
  const cargarCuentasMasUsadas = useCallback(async () => {
    try {
      const masUsadas = await cuentasContablesService.obtenerCuentasMasUtilizadas();
      setCuentasMasUsadas(masUsadas);
    } catch (err) {
      console.error('Error cargando cuentas más usadas:', err);
    }
  }, []);
  
  // Método eliminado - las estadísticas ahora son monetarias
  
  // Buscar cuentas
  const buscarCuentas = useCallback(async (texto: string): Promise<CuentaContable[]> => {
    try {
      return await cuentasContablesService.buscarCuentas(texto);
    } catch (err) {
      console.error('Error buscando cuentas:', err);
      return [];
    }
  }, []);
  
  
  // Obtener cuenta por ID
  const obtenerCuentaPorId = useCallback((id: string): CuentaContable | null => {
    return cuentas.find(cuenta => cuenta.id === id) || null;
  }, [cuentas]);
  
  // Limpiar error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);
  
  // Agrupar por categoría
  const agruparPorCategoria = useCallback((cuentasAgrupar: CuentaContable[]) => {
    return cuentasAgrupar.reduce((grupos, cuenta) => {
      const categoria = cuenta.categoria || 'OTROS';
      if (!grupos[categoria]) {
        grupos[categoria] = [];
      }
      grupos[categoria].push(cuenta);
      return grupos;
    }, {} as Record<string, CuentaContable[]>);
  }, []);
  
  // Obtener cuentas por categoría
  const obtenerCuentasPorCategoria = useCallback((categoria: string) => {
    return cuentas.filter(cuenta => cuenta.categoria === categoria);
  }, [cuentas]);
  
  // Cargar datos iniciales
  useEffect(() => {
    if (autoLoad) {
      const cargarTodo = async () => {
        await cargarCuentas();
        await cargarCuentasMasUsadas();
      };
      cargarTodo();
    }
  }, [autoLoad, cargarCuentas, cargarCuentasMasUsadas]);
  
  return {
    // Estado
    cuentas,
    cuentasMasUsadas,
    loading,
    error,
    
    // Acciones
    cargarCuentas,
    buscarCuentas,
    obtenerCuentaPorId,
    limpiarError,
    
    // Utilidades
    agruparPorCategoria,
    obtenerCuentasPorCategoria,
  };
}
