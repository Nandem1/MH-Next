// src/hooks/useNominasGastos.ts

import { useState, useCallback, useEffect } from 'react';
import { nominasGastosService } from '@/services/nominasGastosService';
import { 
  NominaGasto, 
  FiltrosNominasGastos, 
  PaginationMeta, 
  EstadisticasNominasGastos,
  UseNominasGastosReturn 
} from '@/types/nominasGastos';

// Estado inicial para filtros
const initialFiltros: FiltrosNominasGastos = {
  pagina: 1,
  limite: 20,
  include_stats: true
};

export const useNominasGastos = (): UseNominasGastosReturn => {
  const [nominas, setNominas] = useState<NominaGasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estadisticas, setEstadisticas] = useState<EstadisticasNominasGastos | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    pagina: 1,
    limite: 20,
    total: 0,
    totalPaginas: 0,
    tieneSiguiente: false,
    tieneAnterior: false
  });
  const [filtros, setFiltros] = useState<FiltrosNominasGastos>(initialFiltros);

  // Cargar nóminas con filtros
  const loadNominas = useCallback(async (nuevosFiltros?: FiltrosNominasGastos) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtrosAplicar = nuevosFiltros || filtros;
      const resultado = await nominasGastosService.getNominasGastos(filtrosAplicar);
      
      if (resultado.success) {
        console.log('✅ Datos recibidos del API:', resultado);
        console.log('✅ Nóminas:', resultado.data);
        console.log('✅ Primera nómina:', resultado.data[0]);
        setNominas(resultado.data);
        setPagination(resultado.meta);
        if (resultado.estadisticas) {
          setEstadisticas(resultado.estadisticas);
        }
        // Mantener el estado local de filtros
        if (nuevosFiltros) setFiltros(filtrosAplicar);
      } else {
        setError('Error al cargar nóminas de gastos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar nóminas de gastos');
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Cargar detalle de una nómina específica
  const loadNominaDetalle = useCallback(async (id: number): Promise<NominaGasto> => {
    try {
      setError(null);
      const resultado = await nominasGastosService.getNominaGastoDetalle(id);
      
      if (resultado.success) {
        console.log('✅ Detalle de nómina recibido:', resultado.data);
        console.log('✅ Locales afectados:', resultado.data.locales_afectados);
        console.log('✅ Gastos incluidos:', resultado.data.gastos_incluidos);
        return resultado.data;
      } else {
        throw new Error('Error al cargar detalle de nómina');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar detalle de nómina');
      throw err;
    }
  }, []);

  // Aplicar filtros
  const aplicarFiltros = useCallback((nuevosFiltros: FiltrosNominasGastos) => {
    const filtrosCompletos = {
      ...filtros,
      ...nuevosFiltros,
      pagina: 1, // Resetear a primera página al aplicar filtros
      include_stats: true // Siempre incluir estadísticas
    };
    loadNominas(filtrosCompletos);
  }, [filtros, loadNominas]);

  // Limpiar filtros
  const limpiarFiltros = useCallback(() => {
    const filtrosLimpios = {
      ...initialFiltros,
      include_stats: true
    };
    loadNominas(filtrosLimpios);
  }, [loadNominas]);

  // Cambiar página
  const cambiarPagina = useCallback((nuevaPagina: number) => {
    const nuevosFiltros = {
      ...filtros,
      pagina: nuevaPagina
    };
    loadNominas(nuevosFiltros);
  }, [filtros, loadNominas]);

  // Cambiar límite por página
  const cambiarLimite = useCallback((nuevoLimite: number) => {
    const nuevosFiltros = {
      ...filtros,
      limite: nuevoLimite,
      pagina: 1 // Resetear a primera página al cambiar límite
    };
    loadNominas(nuevosFiltros);
  }, [filtros, loadNominas]);

  // Cargar datos iniciales
  useEffect(() => {
    loadNominas();
  }, [loadNominas]);

  return {
    nominas,
    loading,
    error,
    estadisticas,
    pagination,
    filtros,
    loadNominas,
    loadNominaDetalle,
    aplicarFiltros,
    limpiarFiltros,
    cambiarPagina,
    cambiarLimite
  };
};
