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
  AsignarFacturaRequest,
  AsignarChequeAFacturaRequest
} from "@/types/nominaCheque";
import { CrearChequeRequest } from "@/types/factura";

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
      
      // ✅ Invalidar cache de facturas (para actualizar asignado_a_nomina)
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["facturas", "disponibles"] });
      
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
      
      // ✅ Invalidar cache de facturas (para actualizar asignado_a_nomina)
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["facturas", "disponibles"] });
      
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
      console.log("🔄 [DEBUG] Iniciando asignarCheque en hook:", { nominaId, request });
      setError(null);
      
      await nominaChequeService.asignarCheque(nominaId, request);
      
      console.log("🔄 [DEBUG] Servicio completado, invalidando cache...");
      
      // Invalidar cache de cheques disponibles
      queryClient.invalidateQueries({ queryKey: ["cheques", "disponibles"] });
      
      console.log("🔄 [DEBUG] Cache invalidado, recargando nómina...");
      
      // Recargar la nómina para obtener los datos actualizados
      if (selectedNomina?.id === nominaId) {
        await loadNomina(nominaId);
      }
      
      console.log("✅ [DEBUG] Asignación completada en hook");
      
      // No es necesario recargar toda la lista aquí, el cache invalidation se encargará
      // de actualizar los datos cuando sea necesario
    } catch (err) {
      console.error("❌ [DEBUG] Error en asignarCheque:", err);
      setError(err instanceof Error ? err.message : "Error al asignar cheque");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, queryClient]);

  // Asignar cheque a factura individual
  const asignarChequeAFactura = useCallback(async (nominaId: string, facturaId: number, request: AsignarChequeAFacturaRequest) => {
    try {
      setError(null);
      
      await nominaChequeService.asignarChequeAFactura(nominaId, facturaId, request);
      
      // Invalidar cache de cheques disponibles
      queryClient.invalidateQueries({ queryKey: ["cheques", "disponibles"] });
      
      // Invalidar cache de facturas
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["facturas", "disponibles"] });
      
      // Invalidar cache específico de la factura individual
      queryClient.invalidateQueries({ queryKey: ["factura", facturaId] });
      queryClient.invalidateQueries({ queryKey: ["facturas", "detalle", facturaId] });
      
      // Recargar la nómina seleccionada si existe
      if (selectedNomina?.id) {
        // Pequeño delay para asegurar que el backend procese la actualización
        await new Promise(resolve => setTimeout(resolve, 500));
        await loadNomina(selectedNomina.id);
      }
      
    } catch (err) {
      console.error("❌ Error en asignarChequeAFactura:", err);
      setError(err instanceof Error ? err.message : "Error al asignar cheque a factura");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, queryClient]);

  // Crear y asignar cheque a factura individual
  const crearYAsignarChequeAFactura = useCallback(async (nominaId: string, facturaId: number, request: CrearChequeRequest) => {
    try {
      setError(null);
      
      // Usar directamente el nuevo endpoint que maneja creación y asignación
      const asignacionRequest: AsignarChequeAFacturaRequest = {
        correlativo: request.correlativo,
        monto: request.monto
      };
      
      await nominaChequeService.asignarChequeAFactura(nominaId, facturaId, asignacionRequest);
      
      // Invalidar todas las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["cheques", "disponibles"] });
      queryClient.invalidateQueries({ queryKey: ["cheques"] });
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["facturas", "disponibles"] });
      
      // Invalidar cache específico de la factura individual
      queryClient.invalidateQueries({ queryKey: ["factura", facturaId] });
      queryClient.invalidateQueries({ queryKey: ["facturas", "detalle", facturaId] });
      
      if (selectedNomina?.id) {
        // Pequeño delay para asegurar que el backend procese la actualización
        await new Promise(resolve => setTimeout(resolve, 500));
        await loadNomina(selectedNomina.id);
      }
    } catch (err) {
      console.error("❌ Error en crearYAsignarChequeAFactura:", err);
      setError(err instanceof Error ? err.message : "Error al crear y asignar cheque a factura");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, queryClient]);

  // Actualizar tracking de envío
  const actualizarTracking = useCallback(async (nominaId: string, request: ActualizarTrackingRequest) => {
    try {
      setError(null);
      
      await nominaChequeService.actualizarTracking(nominaId, request);
      
      // Invalidar potenciales caches relacionados
      queryClient.invalidateQueries({ queryKey: ["nominas_list"] });
      queryClient.invalidateQueries({ queryKey: ["nomina:", nominaId] });
      
      // Actualizar la nómina seleccionada si es la misma
      if (selectedNomina?.id === nominaId) {
        await loadNomina(nominaId);
      }
      
      // Refrescar la lista con los filtros actuales
      await loadNominas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar tracking");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, loadNominas, queryClient]);

  // Crear tracking manualmente
  const crearTracking = useCallback(async (nominaId: string) => {
    try {
      setError(null);
      
      await nominaChequeService.crearTracking(nominaId);
      
      // Invalidar potenciales caches relacionados
      queryClient.invalidateQueries({ queryKey: ["nominas_list"] });
      queryClient.invalidateQueries({ queryKey: ["nomina:", nominaId] });
      
      // Actualizar la nómina seleccionada si es la misma
      if (selectedNomina?.id === nominaId) {
        await loadNomina(nominaId);
      }
      
      // Refrescar la lista con los filtros actuales
      await loadNominas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear tracking");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, loadNominas, queryClient]);

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
    asignarChequeAFactura,
    crearYAsignarChequeAFactura,
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