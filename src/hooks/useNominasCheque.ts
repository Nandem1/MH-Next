import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
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
      
      // Usar el endpoint actualizado que maneja la nueva estructura simplificada
      const data = await nominaChequeService.getNominaCompleta(id);
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
      
      // Invalidar cache de nóminas (tabla principal)
      queryClient.invalidateQueries({ queryKey: ["nominas"] });
      
      // Invalidar cache del detalle de nómina específica
      queryClient.invalidateQueries({ queryKey: ["nomina", "detalle", nominaId] });
      queryClient.invalidateQueries({ queryKey: ["nomina", "completa", nominaId] });
      
      // Invalidar cache de todas las consultas de nóminas
      queryClient.invalidateQueries({ queryKey: ["nomina"] });
      
      // Actualizar la nómina seleccionada si es la misma
      if (selectedNomina?.id === nominaId) {
        setSelectedNomina(nominaActualizada);
      }
      
      // No es necesario recargar toda la lista aquí, el cache invalidation se encargará
      // de actualizar los datos cuando sea necesario
    } catch (err) {
      console.error("❌ Error en asignarFacturas:", err);
      setError(err instanceof Error ? err.message : "Error al asignar facturas");
      throw err;
    }
  }, [selectedNomina?.id, queryClient]);

  // Convertir nómina a mixta
  const convertirNominaAMixta = useCallback(async (nominaId: string, facturas: AsignarFacturaRequest[]) => {
    try {
      setError(null);
      
      // El servicio ya retorna la nómina actualizada
      const nominaActualizada = await nominaChequeService.convertirNominaAMixta(nominaId, facturas);
      
      // Invalidar cache de nóminas (tabla principal)
      queryClient.invalidateQueries({ queryKey: ["nominas"] });
      
      // Invalidar cache del detalle de nómina específica
      queryClient.invalidateQueries({ queryKey: ["nomina", "detalle", nominaId] });
      queryClient.invalidateQueries({ queryKey: ["nomina", "completa", nominaId] });
      
      // Invalidar cache de todas las consultas de nóminas
      queryClient.invalidateQueries({ queryKey: ["nomina"] });
      
      // Actualizar la nómina seleccionada si es la misma
      if (selectedNomina?.id === nominaId) {
        setSelectedNomina(nominaActualizada);
      }
      
      // No es necesario recargar toda la lista aquí, el cache invalidation se encargará
      // de actualizar los datos cuando sea necesario
    } catch (err) {
      console.error("❌ Error en convertirNominaAMixta:", err);
      setError(err instanceof Error ? err.message : "Error al convertir nómina a mixta");
      throw err;
    }
  }, [selectedNomina?.id, queryClient]);

  // Asignar cheque a nómina
  const asignarCheque = useCallback(async (nominaId: string, request: AsignarChequeRequest) => {
    try {
      setError(null);
      
      await nominaChequeService.asignarCheque(nominaId, request);
      
      // Invalidar cache de cheques disponibles
      queryClient.invalidateQueries({ queryKey: ["cheques", "disponibles"] });
      
      // Invalidar cache de nóminas (tabla principal)
      queryClient.invalidateQueries({ queryKey: ["nominas"] });
      
      // Invalidar cache del detalle de nómina específica
      queryClient.invalidateQueries({ queryKey: ["nomina", "detalle", nominaId] });
      queryClient.invalidateQueries({ queryKey: ["nomina", "completa", nominaId] });
      
      // Invalidar cache de todas las consultas de nóminas
      queryClient.invalidateQueries({ queryKey: ["nomina"] });
      
      // Recargar la nómina para obtener los datos actualizados
      if (selectedNomina?.id === nominaId) {
        await loadNomina(nominaId);
      }
      
      // No es necesario recargar toda la lista aquí, el cache invalidation se encargará
      // de actualizar los datos cuando sea necesario
    } catch (err) {
      console.error("❌ Error en asignarCheque:", err);
      setError(err instanceof Error ? err.message : "Error al asignar cheque");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, queryClient]);

  // Actualizar tracking de envío
  const actualizarTracking = useCallback(async (nominaId: string, request: ActualizarTrackingRequest) => {
    try {
      setError(null);
      
      await nominaChequeService.actualizarTracking(nominaId, request);
      
      // Invalidar cache de nóminas (tabla principal)
      queryClient.invalidateQueries({ queryKey: ["nominas"] });
      
      // Invalidar cache del detalle de nómina específica
      queryClient.invalidateQueries({ queryKey: ["nomina", "detalle", nominaId] });
      queryClient.invalidateQueries({ queryKey: ["nomina", "completa", nominaId] });
      
      // Invalidar cache de todas las consultas de nóminas
      queryClient.invalidateQueries({ queryKey: ["nomina"] });
      
      // Actualizar la nómina seleccionada si es la misma
      if (selectedNomina?.id === nominaId) {
        await loadNomina(nominaId);
      }
      
      // No es necesario recargar toda la lista aquí, el cache invalidation se encargará
      // de actualizar los datos cuando sea necesario
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar tracking");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, queryClient]);

  // Crear tracking manualmente
  const crearTracking = useCallback(async (nominaId: string) => {
    try {
      setError(null);
      
      await nominaChequeService.crearTracking(nominaId);
      
      // Invalidar cache de nóminas (tabla principal)
      queryClient.invalidateQueries({ queryKey: ["nominas"] });
      
      // Invalidar cache del detalle de nómina específica
      queryClient.invalidateQueries({ queryKey: ["nomina", "detalle", nominaId] });
      queryClient.invalidateQueries({ queryKey: ["nomina", "completa", nominaId] });
      
      // Invalidar cache de todas las consultas de nóminas
      queryClient.invalidateQueries({ queryKey: ["nomina"] });
      
      // Actualizar la nómina seleccionada si es la misma
      if (selectedNomina?.id === nominaId) {
        await loadNomina(nominaId);
      }
      
      // No es necesario recargar toda la lista aquí, el cache invalidation se encargará
      // de actualizar los datos cuando sea necesario
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear tracking");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, queryClient]);

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