"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { 
  rindeGastosService, 
  type Gasto, 
  type CrearGastoRequest, 
  type FiltrosGastos 
} from "@/services/rindeGastosService";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useCajaChica } from "@/hooks/useCajaChica";

interface UseRindeGastosOptions {
  filtros?: FiltrosGastos;
  showSnackbar?: (message: string, severity: "success" | "error" | "info" | "warning") => void;
}

/**
 * Hook principal para el sistema de rinde gastos
 * Integra gastos, cuentas contables y caja chica
 */
export function useRindeGastos(options: UseRindeGastosOptions = {}) {
  const { filtros = {}, showSnackbar: externalShowSnackbar } = options;
  const { usuario } = useAuth();
  const queryClient = useQueryClient();
  const { showSnackbar: internalShowSnackbar } = useSnackbar();
  const { estadoCajaChica, refetchEstadoCaja, loadingEstadoCaja } = useCajaChica();
  
  // Usar la función externa si se proporciona, sino usar la interna
  const showSnackbar = externalShowSnackbar || internalShowSnackbar;
  
  // ===== QUERIES =====
  
  /**
   * Obtener gastos con paginación y filtros
   */
  const {
    data: gastosData,
    isLoading: loadingGastos,
    error: errorGastos,
    refetch: refetchGastos
  } = useQuery({
    queryKey: ['gastos', usuario?.id_local, filtros],
    queryFn: () => rindeGastosService.obtenerGastos(filtros),
    enabled: !!usuario?.id_local,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  
  /**
   * Obtener cuentas contables más utilizadas
   */
  const {
    data: cuentasMasUtilizadas,
    isLoading: loadingCuentasMasUtilizadas,
    error: errorCuentasMasUtilizadas
  } = useQuery({
    queryKey: ['cuentas-mas-utilizadas', usuario?.id_local],
    queryFn: () => rindeGastosService.obtenerCuentasMasUtilizadas(),
    enabled: !!usuario?.id_local,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas (datos estáticos)
  });
  
  /**
   * Obtener todas las cuentas contables
   */
  const {
    data: todasLasCuentas,
    isLoading: loadingTodasLasCuentas,
    error: errorTodasLasCuentas
  } = useQuery({
    queryKey: ['cuentas-contables', usuario?.id_local],
    queryFn: () => rindeGastosService.obtenerCuentasContables(),
    enabled: !!usuario?.id_local,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
  });
  
  /**
   * Obtener estadísticas monetarias
   */
  const {
    data: estadisticas,
    isLoading: loadingEstadisticas,
    error: errorEstadisticas,
    refetch: refetchEstadisticas
  } = useQuery({
    queryKey: ['estadisticas-monetarias', usuario?.id_local],
    queryFn: () => rindeGastosService.obtenerEstadisticasMonetarias(),
    enabled: !!usuario?.id_local,
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
  
  // ===== MUTATIONS =====
  
  /**
   * Crear nuevo gasto con optimistic update
   */
  const crearGastoMutation = useMutation({
    mutationFn: async (gastoData: CrearGastoRequest) => {
      // Verificar saldo antes de crear
      const tieneSaldo = await rindeGastosService.verificarSaldoDisponible(gastoData.monto);
      if (!tieneSaldo) {
        throw new Error(`Saldo insuficiente. Saldo disponible: $${estadoCajaChica?.montoActual?.toLocaleString() || 0}`);
      }
      
      return rindeGastosService.crearGasto(gastoData);
    },
    onMutate: async (nuevoGasto) => {
      // Cancelar queries en curso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: ['gastos', usuario?.id_local] });
      await queryClient.cancelQueries({ queryKey: ['estadisticas-monetarias', usuario?.id_local] });
      
      // Snapshot del estado anterior
      const previousGastos = queryClient.getQueryData(['gastos', usuario?.id_local]);
      const previousEstadisticas = queryClient.getQueryData(['estadisticas-monetarias', usuario?.id_local]);
      
      // Optimistic update: agregar el gasto temporalmente
      queryClient.setQueryData(['gastos', usuario?.id_local], (old: unknown) => {
        if (!old) return old;
        
        const oldTyped = old as { data?: Gasto[]; meta?: { total?: number; totalGastos?: number } };
        
        const gastoTemporal: Gasto = {
          id: `temp_${Date.now()}`,
          descripcion: nuevoGasto.descripcion,
          monto: nuevoGasto.monto.toString(),
          fecha: new Date(nuevoGasto.fecha).toISOString(),
          categoria: nuevoGasto.categoria,
          comprobante: nuevoGasto.comprobante_url || null,
          observaciones: nuevoGasto.observaciones || null,
          fechaCreacion: new Date().toISOString(),
          nombreCuentaContable: "Cargando...",
          nombreUsuario: usuario?.nombre || "Usuario",
          nombreLocal: estadoCajaChica?.nombreLocal || "Local",
        };
        
        return {
          ...old,
          data: [gastoTemporal, ...(oldTyped.data || [])],
          meta: {
            ...oldTyped.meta,
            total: (oldTyped.meta?.total || 0) + 1,
            totalGastos: (oldTyped.meta?.totalGastos || 0) + 1,
          }
        };
      });
      
      return { previousGastos, previousEstadisticas };
    },
    onSuccess: (nuevoGasto: Gasto) => {
      showSnackbar(
        `✅ Gasto creado exitosamente: $${parseFloat(nuevoGasto.monto).toLocaleString()}`,
        "success"
      );
      
      // Invalidar queries relacionadas para obtener datos actualizados
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      queryClient.invalidateQueries({ queryKey: ['caja-chica'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-monetarias'] });
      
      // Refrescar estado de caja chica
      refetchEstadoCaja();
    },
    onError: (error: Error, variables, context) => {
      // Revertir optimistic update en caso de error
      if (context?.previousGastos) {
        queryClient.setQueryData(['gastos', usuario?.id_local], context.previousGastos);
      }
      if (context?.previousEstadisticas) {
        queryClient.setQueryData(['estadisticas-monetarias', usuario?.id_local], context.previousEstadisticas);
      }
      
      showSnackbar(`❌ ${error.message}`, "error");
    }
  });
  
  /**
   * Eliminar gasto
   */
  const eliminarGastoMutation = useMutation({
    mutationFn: (gastoId: string) => rindeGastosService.eliminarGasto(gastoId),
    onSuccess: () => {
      showSnackbar("✅ Gasto eliminado exitosamente", "success");
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      queryClient.invalidateQueries({ queryKey: ['caja-chica'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-monetarias'] });
      
      // Refrescar estado de caja chica
      refetchEstadoCaja();
    },
    onError: (error: Error) => {
      showSnackbar(`❌ ${error.message}`, "error");
    }
  });
  
  /**
   * Verificar saldo disponible
   */
  const verificarSaldoMutation = useMutation({
    mutationFn: (monto: number) => rindeGastosService.verificarSaldoDisponible(monto),
  });
  
  // ===== COMPUTED VALUES =====
  
  const gastos = gastosData?.data || [];
  const pagination = gastosData?.meta;
  const filtrosAplicados = gastosData?.filtros_aplicados;
  
  // Información del local
  const localInfo = {
    id: estadoCajaChica?.localId || usuario?.id_local || 0,
    nombre: estadoCajaChica?.nombreLocal || "Local no encontrado",
  };
  
  // Estado general del sistema
  const estadoSistema = {
    puedeCrearGastos: estadoCajaChica ? 
      (estadoCajaChica.montoActual || 0) > (estadoCajaChica.limiteMinimo || 0) : 
      false,
    saldoActual: estadoCajaChica?.montoActual || 0,
    montoFijo: estadoCajaChica?.montoFijo || 0,
    limiteMinimo: estadoCajaChica?.limiteMinimo || 0,
  };
  
  // ===== UTILITY FUNCTIONS =====
  
  const buscarCuentas = async (texto: string) => {
    try {
      const todasCuentas = todasLasCuentas || [];
      const textoLower = texto.toLowerCase();
      return todasCuentas.filter(cuenta => 
        cuenta.nombre.toLowerCase().includes(textoLower)
      );
    } catch {
      showSnackbar("Error al buscar cuentas", "error");
      return [];
    }
  };
  
  const obtenerCuentaPorId = async (id: string) => {
    try {
      const todasCuentas = todasLasCuentas || [];
      return todasCuentas.find(c => c.id === id) || null;
    } catch {
      showSnackbar("Error al obtener cuenta", "error");
      return null;
    }
  };
  
  const verificarSaldo = async (monto: number) => {
    try {
      return await verificarSaldoMutation.mutateAsync(monto);
    } catch {
      return false;
    }
  };
  
  const refetchAll = () => {
    refetchGastos();
    refetchEstadoCaja();
    refetchEstadisticas();
  };
  
  // ===== ACTIONS =====
  
  const crearGasto = (gastoData: CrearGastoRequest) => {
    crearGastoMutation.mutate(gastoData);
  };
  
  const eliminarGasto = (gastoId: string) => {
    eliminarGastoMutation.mutate(gastoId);
  };
  
  return {
    // Data
    gastos,
    pagination,
    filtrosAplicados,
    cuentasMasUtilizadas,
    todasLasCuentas,
    estadisticas,
    localInfo,
    estadoSistema,
    
    // Loading states
    loadingGastos,
    loadingCuentasMasUtilizadas,
    loadingTodasLasCuentas,
    loadingEstadisticas,
    loadingEstadoCaja,
    loadingCrearGasto: crearGastoMutation.isPending,
    loadingEliminarGasto: eliminarGastoMutation.isPending,
    loadingVerificarSaldo: verificarSaldoMutation.isPending,
    
    // Error states
    errorGastos,
    errorCuentasMasUtilizadas,
    errorTodasLasCuentas,
    errorEstadisticas,
    
    // Actions
    crearGasto,
    eliminarGasto,
    buscarCuentas,
    obtenerCuentaPorId,
    verificarSaldo,
    refetchAll,
    refetchGastos,
    refetchEstadisticas,
  };
}

/**
 * Hook para obtener un gasto específico por ID
 */
export function useGasto(gastoId: string) {
  const { usuario } = useAuth();
  
  return useQuery({
    queryKey: ['gasto', gastoId, usuario?.id_local],
    queryFn: () => rindeGastosService.obtenerGastoPorId(gastoId),
    enabled: !!gastoId && !!usuario?.id_local,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook simplificado para solo obtener gastos
 */
export function useGastos(filtros: FiltrosGastos = {}) {
  const { usuario } = useAuth();
  
  return useQuery({
    queryKey: ['gastos-simple', usuario?.id_local, filtros],
    queryFn: () => rindeGastosService.obtenerGastos(filtros),
    enabled: !!usuario?.id_local,
    staleTime: 5 * 60 * 1000,
  });
}