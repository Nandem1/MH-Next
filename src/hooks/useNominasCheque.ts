import { useState, useEffect, useCallback } from "react";
import { NominaCheque, CrearNominaChequeRequest, FiltroNominas, TrackingEnvio } from "@/types/nominaCheque";
import { nominaChequeService } from "@/services/nominaChequeService";
import { mockNominasCheque, mockFacturasDisponibles } from "@/data/nominasChequeMock";
import { useAuthStatus } from "@/hooks/useAuthStatus";

// Flag para usar datos mock (cambiar a false cuando el backend esté listo)
const USE_MOCK_DATA = true;

export const useNominasCheque = () => {
  const { usuario } = useAuthStatus();
  const [nominas, setNominas] = useState<NominaCheque[]>([]);
  const [nominasFiltradas, setNominasFiltradas] = useState<NominaCheque[]>([]);
  const [filtro, setFiltro] = useState<FiltroNominas>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNomina, setSelectedNomina] = useState<NominaCheque | null>(null);

  // Aplicar filtros
  const aplicarFiltros = useCallback((nominasData: NominaCheque[], filtros: FiltroNominas) => {
    let resultado = [...nominasData];

    if (filtros.local) {
      resultado = resultado.filter(nomina => nomina.local === filtros.local);
    }

    if (filtros.estado) {
      resultado = resultado.filter(nomina => nomina.estado === filtros.estado);
    }

    if (filtros.fechaDesde) {
      resultado = resultado.filter(nomina => 
        new Date(nomina.fechaCreacion) >= new Date(filtros.fechaDesde!)
      );
    }

    if (filtros.fechaHasta) {
      resultado = resultado.filter(nomina => 
        new Date(nomina.fechaCreacion) <= new Date(filtros.fechaHasta!)
      );
    }

    return resultado;
  }, []);

  // Actualizar nóminas filtradas cuando cambien los filtros o las nóminas
  useEffect(() => {
    setNominasFiltradas(aplicarFiltros(nominas, filtro));
  }, [nominas, filtro, aplicarFiltros]);

  // Cargar todas las nóminas
  const loadNominas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        setNominas(mockNominasCheque);
      } else {
        const data = await nominaChequeService.getNominas();
        setNominas(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar nóminas");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar una nómina específica con sus cheques
  const loadNomina = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 300));
        const nomina = mockNominasCheque.find(n => n.id === id);
        if (!nomina) {
          throw new Error("Nómina no encontrada");
        }
        setSelectedNomina(nomina);
        return nomina;
      } else {
        const nomina = await nominaChequeService.getNomina(id);
        setSelectedNomina(nomina);
        return nomina;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar nómina");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva nómina
  const crearNomina = useCallback(async (request: CrearNominaChequeRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generar correlativos
        const correlativoFinal = (parseInt(request.correlativoInicial) + 9).toString().padStart(6, '0');
        
        // Crear nueva nómina mock
        const nuevaNomina: NominaCheque = {
          id: (mockNominasCheque.length + 1).toString(),
          nombre: request.nombre,
          correlativoInicial: request.correlativoInicial,
          correlativoFinal,
          fechaCreacion: new Date().toISOString(),
          creadoPor: usuario?.nombre || "Usuario Actual",
          local: request.local,
          estado: "ACTIVA",
          totalCheques: 10,
          chequesDisponibles: 10,
          chequesAsignados: 0,
          chequesPagados: 0,
          trackingEnvio: {
            id: `track-${mockNominasCheque.length + 1}`,
            estado: "EN_ORIGEN",
            localOrigen: request.local,
          },
          cheques: Array.from({ length: 10 }, (_, i) => ({
            id: `${mockNominasCheque.length + 1}-${i + 1}`,
            numeroCorrelativo: (parseInt(request.correlativoInicial) + i).toString().padStart(6, '0'),
            estado: "DISPONIBLE" as const,
          })),
        };
        
        // Agregar a la lista mock
        mockNominasCheque.unshift(nuevaNomina);
        setNominas(prev => [nuevaNomina, ...prev]);
        return nuevaNomina;
      } else {
        const nuevaNomina = await nominaChequeService.crearNomina(request);
        setNominas(prev => [nuevaNomina, ...prev]);
        return nuevaNomina;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear nómina");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [usuario?.nombre]);

  // Actualizar tracking de envío
  const actualizarTracking = useCallback(async (nominaId: string, trackingData: Partial<TrackingEnvio>) => {
    try {
      setError(null);
      
      if (USE_MOCK_DATA) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Encontrar la nómina
        const nominaIndex = mockNominasCheque.findIndex(n => n.id === nominaId);
        if (nominaIndex === -1) {
          throw new Error("Nómina no encontrada");
        }
        
        const nomina = mockNominasCheque[nominaIndex];
        
        // Actualizar tracking con información del usuario actual
        if (nomina.trackingEnvio) {
          nomina.trackingEnvio = {
            ...nomina.trackingEnvio,
            ...trackingData,
            // Agregar información del usuario que realiza la acción
            enviadoPor: trackingData.estado === "EN_TRANSITO" ? usuario?.nombre : nomina.trackingEnvio.enviadoPor,
            recibidoPor: trackingData.estado === "RECIBIDA" ? usuario?.nombre : nomina.trackingEnvio.recibidoPor,
          };
        } else {
          nomina.trackingEnvio = {
            id: `track-${nominaId}`,
            estado: trackingData.estado || "EN_ORIGEN",
            localOrigen: nomina.local,
            ...trackingData,
            enviadoPor: trackingData.estado === "EN_TRANSITO" ? usuario?.nombre : undefined,
            recibidoPor: trackingData.estado === "RECIBIDA" ? usuario?.nombre : undefined,
          };
        }
        
        // Actualizar estado local
        setNominas(prev => [...prev]);
        if (selectedNomina?.id === nominaId) {
          setSelectedNomina({ ...nomina });
        }
      } else {
        await nominaChequeService.actualizarTracking(nominaId, trackingData);
        
        // Actualizar la nómina seleccionada si es la misma
        if (selectedNomina?.id === nominaId) {
          await loadNomina(nominaId);
        }
        
        // Actualizar la lista de nóminas
        await loadNominas();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar tracking");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, loadNominas, usuario?.nombre]);

  // Asignar cheque a factura
  const asignarCheque = useCallback(async (nominaId: string, chequeId: string, facturaId: string) => {
    try {
      setError(null);
      
      if (USE_MOCK_DATA) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Encontrar la nómina y el cheque
        const nominaIndex = mockNominasCheque.findIndex(n => n.id === nominaId);
        if (nominaIndex === -1) {
          throw new Error("Nómina no encontrada");
        }
        
        const nomina = mockNominasCheque[nominaIndex];
        const chequeIndex = nomina.cheques.findIndex(c => c.id === chequeId);
        if (chequeIndex === -1) {
          throw new Error("Cheque no encontrado");
        }
        
        // Encontrar la factura
        const factura = mockFacturasDisponibles.find(f => f.id === facturaId);
        if (!factura) {
          throw new Error("Factura no encontrada");
        }
        
        // Actualizar el cheque
        nomina.cheques[chequeIndex] = {
          ...nomina.cheques[chequeIndex],
          estado: "ASIGNADO",
          facturaAsociada: {
            id: factura.id,
            folio: factura.folio,
            proveedor: factura.proveedor,
            monto: factura.monto,
            estado: "ASIGNADA",
            fechaIngreso: new Date().toISOString(),
          },
          fechaAsignacion: new Date().toISOString(),
        };
        
        // Actualizar contadores
        nomina.chequesDisponibles--;
        nomina.chequesAsignados++;
        
        // Actualizar estado local
        setNominas(prev => [...prev]);
        if (selectedNomina?.id === nominaId) {
          setSelectedNomina({ ...nomina });
        }
      } else {
        await nominaChequeService.asignarCheque(nominaId, chequeId, facturaId);
        
        // Actualizar la nómina seleccionada si es la misma
        if (selectedNomina?.id === nominaId) {
          await loadNomina(nominaId);
        }
        
        // Actualizar la lista de nóminas
        await loadNominas();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar cheque");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, loadNominas]);

  // Marcar cheque como pagado
  const marcarChequePagado = useCallback(async (nominaId: string, chequeId: string) => {
    try {
      setError(null);
      
      if (USE_MOCK_DATA) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Encontrar la nómina y el cheque
        const nominaIndex = mockNominasCheque.findIndex(n => n.id === nominaId);
        if (nominaIndex === -1) {
          throw new Error("Nómina no encontrada");
        }
        
        const nomina = mockNominasCheque[nominaIndex];
        const chequeIndex = nomina.cheques.findIndex(c => c.id === chequeId);
        if (chequeIndex === -1) {
          throw new Error("Cheque no encontrado");
        }
        
        // Actualizar el cheque
        nomina.cheques[chequeIndex] = {
          ...nomina.cheques[chequeIndex],
          estado: "PAGADO",
          fechaPago: new Date().toISOString(),
        };
        
        // Actualizar contadores
        nomina.chequesAsignados--;
        nomina.chequesPagados++;
        
        // Verificar si la nómina está completa
        if (nomina.chequesPagados === nomina.totalCheques) {
          nomina.estado = "COMPLETADA";
        }
        
        // Actualizar estado local
        setNominas(prev => [...prev]);
        if (selectedNomina?.id === nominaId) {
          setSelectedNomina({ ...nomina });
        }
      } else {
        await nominaChequeService.marcarChequePagado(nominaId, chequeId);
        
        // Actualizar la nómina seleccionada si es la misma
        if (selectedNomina?.id === nominaId) {
          await loadNomina(nominaId);
        }
        
        // Actualizar la lista de nóminas
        await loadNominas();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al marcar cheque como pagado");
      throw err;
    }
  }, [selectedNomina?.id, loadNomina, loadNominas]);

  // Obtener facturas disponibles
  const getFacturasDisponibles = useCallback(async () => {
    try {
      if (USE_MOCK_DATA) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockFacturasDisponibles;
      } else {
        return await nominaChequeService.getFacturasDisponibles();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener facturas disponibles");
      throw err;
    }
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar nóminas al montar el componente
  useEffect(() => {
    loadNominas();
  }, [loadNominas]);

  return {
    nominas: nominasFiltradas,
    todasLasNominas: nominas,
    selectedNomina,
    filtro,
    loading,
    error,
    loadNominas,
    loadNomina,
    crearNomina,
    asignarCheque,
    marcarChequePagado,
    actualizarTracking,
    getFacturasDisponibles,
    clearError,
    setSelectedNomina,
    setFiltro,
  };
}; 