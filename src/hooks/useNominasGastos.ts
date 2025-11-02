// src/hooks/useNominasGastos.ts

import { useState, useCallback, useEffect } from 'react';
import { nominasGastosService } from '@/services/nominasGastosService';
import { 
  NominaGasto, 
  FiltrosNominasGastos, 
  PaginationMeta, 
  EstadisticasNominasGastos,
  EstadisticasActivas,
  UseNominasGastosReturn 
} from '@/types/nominasGastos';

// Estado inicial para filtros
const initialFiltros: FiltrosNominasGastos = {
  pagina: 1,
  limite: 20,
  include_stats: true,
  stats_tipo: 'historicas' // Por defecto, pedir estadísticas históricas
};

export const useNominasGastos = (): UseNominasGastosReturn => {
  const [nominas, setNominas] = useState<NominaGasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estadisticas, setEstadisticas] = useState<EstadisticasNominasGastos | null>(null);
  const [estadisticasActivas, setEstadisticasActivas] = useState<EstadisticasActivas | null>(null);
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
        
        // Nota: El backend debe enviar los datos ya ordenados con:
        // 1. Rendiciones activas (tipo: 'rendicion_activa') primero
        // 2. Luego ordenados por antigüedad (fecha_creacion ASC - más antiguas primero)
        // No reordenamos en el frontend para mantener consistencia con la paginación del backend
        setNominas(resultado.data);
        setPagination(resultado.meta);
        
        // Manejar estadísticas históricas
        if (resultado.estadisticas) {
          setEstadisticas(resultado.estadisticas);
        } else if (resultado.estadisticas_historicas) {
          setEstadisticas(resultado.estadisticas_historicas);
        } else {
          setEstadisticas(null);
        }
        
        // Manejar estadísticas activas
        if (resultado.estadisticas_activas) {
          setEstadisticasActivas(resultado.estadisticas_activas);
        } else {
          setEstadisticasActivas(null);
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

  // Cargar solo estadísticas sin recargar las nóminas
  const loadEstadisticas = useCallback(async (statsTipo: 'historicas' | 'activas') => {
    try {
      // Mantener los filtros actuales pero solo cambiar stats_tipo
      const filtrosEstadisticas = {
        ...filtros,
        include_stats: true,
        stats_tipo: statsTipo,
        limite: 1, // Solo necesitamos 1 resultado para obtener estadísticas
        pagina: 1
      };
      
      const resultado = await nominasGastosService.getNominasGastos(filtrosEstadisticas);
      
      if (resultado.success) {
        // Solo actualizar estadísticas, NO actualizar nominas ni paginación
        if (resultado.estadisticas) {
          setEstadisticas(resultado.estadisticas);
        } else if (resultado.estadisticas_historicas) {
          setEstadisticas(resultado.estadisticas_historicas);
        } else {
          setEstadisticas(null);
        }
        
        if (resultado.estadisticas_activas) {
          setEstadisticasActivas(resultado.estadisticas_activas);
        } else {
          setEstadisticasActivas(null);
        }

        // Mantener el filtro en sincronía con la selección actual para futuras peticiones
        setFiltros((prevFiltros) => ({
          ...prevFiltros,
          stats_tipo: statsTipo,
        }));
        
        // Importante: no disparamos loadNominas aquí, solo sincronizamos el filtro
      }
    } catch (err) {
      // No mostramos error aquí para no interrumpir la experiencia
      // Solo loggeamos silenciosamente
      console.error('Error al cargar estadísticas:', err);
    }
  }, [filtros]);

  // Cargar detalle de una nómina específica
  // Nota: El ID puede ser string (rendiciones activas) o number (nóminas generadas)
  const loadNominaDetalle = useCallback(async (id: string | number): Promise<NominaGasto> => {
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
      include_stats: true, // Siempre incluir estadísticas
      stats_tipo: nuevosFiltros.stats_tipo || 'historicas' // Mantener históricas por defecto
    };
    loadNominas(filtrosCompletos);
  }, [filtros, loadNominas]);

  // Limpiar filtros
  const limpiarFiltros = useCallback(() => {
    const filtrosLimpios: FiltrosNominasGastos = {
      ...initialFiltros,
      include_stats: true,
      stats_tipo: 'historicas' // Resetear a históricas por defecto
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

  // Cargar datos iniciales solo una vez al montar
  useEffect(() => {
    loadNominas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar al montar, no re-ejecutar cuando cambie loadNominas

  return {
    nominas,
    loading,
    error,
    estadisticas,
    estadisticasActivas,
    pagination,
    filtros,
    loadNominas,
    loadNominaDetalle,
    loadEstadisticas,
    aplicarFiltros,
    limpiarFiltros,
    cambiarPagina,
    cambiarLimite
  };
};
