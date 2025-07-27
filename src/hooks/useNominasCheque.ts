import { useState, useCallback, useEffect } from "react";
import { nominaChequeService } from "@/services/nominaChequeService";
import { 
  NominaCantera, 
  CrearNominaRequest, 
  AsignarChequeRequest, 
  ActualizarTrackingRequest,
  FiltrosNominas,
  PaginationInfo,
  CrearNominaMixtaRequest,
  AsignarFacturaRequest
} from "@/types/nominaCheque";

// Estado inicial para filtros
const initialFiltros: FiltrosNominas = {
  page: 1,
  limit: 10
};

export const useNominasCheque = () => {
  const [nominas, setNominas] = useState<NominaCantera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNomina, setSelectedNomina] = useState<NominaCantera | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    hasNext: false
  });
  const [filtros, setFiltros] = useState<FiltrosNominas>(initialFiltros);

  // Cargar nóminas con filtros
  const loadNominas = useCallback(async (nuevosFiltros?: FiltrosNominas) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtrosAplicar = nuevosFiltros || filtros;
      const resultado = await nominaChequeService.getNominas(filtrosAplicar);
      
      setNominas(resultado.nominas);
      setPagination(resultado.pagination);
      // Solo actualizar filtros si se pasaron nuevos filtros
      if (nuevosFiltros) {
        setFiltros(resultado.filtros);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar nóminas");
    } finally {
      setLoading(false);
    }
  }, [filtros]); // Incluir filtros en las dependencias

  // Aplicar filtros
  const aplicarFiltros = useCallback(async (nuevosFiltros: FiltrosNominas) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtrosCombinados = {
        ...nuevosFiltros,
        page: 1 // Resetear a primera página al aplicar filtros
      };
      
      const resultado = await nominaChequeService.getNominas(filtrosCombinados);
      
      setNominas(resultado.nominas);
      setPagination(resultado.pagination);
      setFiltros(resultado.filtros);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al aplicar filtros");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cambiar página
  const cambiarPagina = useCallback(async (nuevaPagina: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtrosActualizados = {
        ...filtros,
        page: nuevaPagina
      };
      
      const resultado = await nominaChequeService.getNominas(filtrosActualizados);
      
      setNominas(resultado.nominas);
      setPagination(resultado.pagination);
      setFiltros(resultado.filtros);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar página");
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Cambiar límite por página
  const cambiarLimite = useCallback(async (nuevoLimite: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtrosActualizados = {
        ...filtros,
        limit: nuevoLimite,
        page: 1 // Resetear a primera página
      };
      
      const resultado = await nominaChequeService.getNominas(filtrosActualizados);
      
      setNominas(resultado.nominas);
      setPagination(resultado.pagination);
      setFiltros(resultado.filtros);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar límite");
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Limpiar filtros
  const limpiarFiltros = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filtrosLimpios = {
        page: 1,
        limit: 10
      };
      
      const resultado = await nominaChequeService.getNominas(filtrosLimpios);
      
      setNominas(resultado.nominas);
      setPagination(resultado.pagination);
      setFiltros(resultado.filtros);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al limpiar filtros");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar nóminas al montar el componente
  useEffect(() => {
    const cargarInicial = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const resultado = await nominaChequeService.getNominas({
          page: 1,
          limit: 10
        });
        
        setNominas(resultado.nominas);
        setPagination(resultado.pagination);
        setFiltros(resultado.filtros);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar nóminas");
      } finally {
        setLoading(false);
      }
    };
    
    cargarInicial();
  }, []); // Solo se ejecuta al montar el componente

  // Cargar nómina específica con detalles completos
  const loadNomina = useCallback(async (id: string) => {
    try {
      setError(null);
      
      // Siempre usar el endpoint que trae las facturas para ambos tipos de nómina
      const data = await nominaChequeService.getNominaCompletaConFacturas(id);
      setSelectedNomina(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar nómina");
      throw err;
    }
  }, []);

  // Crear nueva nómina
  const crearNomina = useCallback(async (request: CrearNominaRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const nuevaNomina = await nominaChequeService.crearNomina(request);
      setNominas(prev => [nuevaNomina, ...prev]);
      return nuevaNomina;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear nómina");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nómina mixta
  const crearNominaMixta = useCallback(async (request: CrearNominaMixtaRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const nuevaNomina = await nominaChequeService.crearNominaMixta(request);
      setNominas(prev => [nuevaNomina, ...prev]);
      return nuevaNomina;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear nómina mixta");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Asignar facturas a nómina
  const asignarFacturas = useCallback(async (nominaId: string, facturas: AsignarFacturaRequest[]) => {
    try {
      setError(null);
      
      // El servicio ya retorna la nómina actualizada
      const nominaActualizada = await nominaChequeService.asignarFacturasANomina(nominaId, facturas);
      
      // Actualizar la nómina seleccionada si es la misma
      if (selectedNomina?.id === nominaId) {
        setSelectedNomina(nominaActualizada);
      }
      
      // Actualizar la lista de nóminas con los filtros actuales
      const resultado = await nominaChequeService.getNominas(filtros);
      setNominas(resultado.nominas);
      setPagination(resultado.pagination);
    } catch (err) {
      console.error("❌ Error en asignarFacturas:", err);
      setError(err instanceof Error ? err.message : "Error al asignar facturas");
      throw err;
    }
  }, [selectedNomina?.id, filtros]);

  // Convertir nómina a mixta
  const convertirNominaAMixta = useCallback(async (nominaId: string, facturas: AsignarFacturaRequest[]) => {
    try {
      setError(null);
      
      // El servicio ya retorna la nómina actualizada
      const nominaActualizada = await nominaChequeService.convertirNominaAMixta(nominaId, facturas);
      
      // Actualizar la nómina seleccionada si es la misma
      if (selectedNomina?.id === nominaId) {
        setSelectedNomina(nominaActualizada);
      }
      
      // Actualizar la lista de nóminas con los filtros actuales
      const resultado = await nominaChequeService.getNominas(filtros);
      setNominas(resultado.nominas);
      setPagination(resultado.pagination);
    } catch (err) {
      console.error("❌ Error en convertirNominaAMixta:", err);
      setError(err instanceof Error ? err.message : "Error al convertir nómina a mixta");
      throw err;
    }
  }, [selectedNomina?.id, filtros]);

  // Asignar cheque a nómina
  const asignarCheque = useCallback(async (nominaId: string, request: AsignarChequeRequest) => {
    try {
      setError(null);
      
  
      
      await nominaChequeService.asignarCheque(nominaId, request);
      
      // Recargar la nómina para obtener los datos actualizados
      if (selectedNomina?.id === nominaId) {
        await loadNomina(nominaId);
      }
      
      // Actualizar la lista de nóminas con los filtros actuales
      const resultado = await nominaChequeService.getNominas(filtros);
      setNominas(resultado.nominas);
      setPagination(resultado.pagination);
    } catch (err) {
      console.error("❌ Error en asignarCheque:", err);
      setError(err instanceof Error ? err.message : "Error al asignar cheque");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, filtros]);

  // Actualizar tracking de envío
  const actualizarTracking = useCallback(async (nominaId: string, request: ActualizarTrackingRequest) => {
    try {
      setError(null);
      
      await nominaChequeService.actualizarTracking(nominaId, request);
      
      // Actualizar la nómina seleccionada si es la misma
      if (selectedNomina?.id === nominaId) {
        await loadNomina(nominaId);
      }
      
      // Actualizar la lista de nóminas con los filtros actuales
      const resultado = await nominaChequeService.getNominas(filtros);
      setNominas(resultado.nominas);
      setPagination(resultado.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar tracking");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, filtros]);

  // Crear tracking manualmente
  const crearTracking = useCallback(async (nominaId: string) => {
    try {
      setError(null);
      
      await nominaChequeService.crearTracking(nominaId);
      
      // Actualizar la nómina seleccionada si es la misma
      if (selectedNomina?.id === nominaId) {
        await loadNomina(nominaId);
      }
      
      // Actualizar la lista de nóminas con los filtros actuales
      const resultado = await nominaChequeService.getNominas(filtros);
      setNominas(resultado.nominas);
      setPagination(resultado.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear tracking");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, filtros]);

  // Obtener nóminas por estado de tracking
  const getNominasPorEstadoTracking = useCallback(async (estado: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await nominaChequeService.getNominasPorEstadoTracking(estado);
      setNominas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al filtrar nóminas");
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener todas las nóminas con tracking
  const getNominasConTracking = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nominaChequeService.getNominasConTracking();
      setNominas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar nóminas con tracking");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    nominas,
    selectedNomina,
    loading,
    error,
    crearNomina,
    crearNominaMixta,
    asignarCheque,
    asignarFacturas,
    convertirNominaAMixta,
    actualizarTracking,
    crearTracking,
    loadNominas,
    loadNomina,
    getNominasPorEstadoTracking,
    getNominasConTracking,
    setSelectedNomina,
    setError,
    pagination,
    filtros,
    aplicarFiltros,
    cambiarPagina,
    cambiarLimite,
    limpiarFiltros,
  };
}; 