"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { gastosService } from "@/services/gastosService";
import { useSnackbar } from "@/hooks/useSnackbar";

interface UseCajaChicaOptions {
  showSnackbar?: (message: string, severity: "success" | "error" | "info" | "warning") => void;
}

/**
 * Hook personalizado para manejar la caja chica del usuario
 * Sistema basado en usuarios individuales
 */
export function useCajaChica(options: UseCajaChicaOptions = {}) {
  const { showSnackbar: externalShowSnackbar } = options;
  const { usuario } = useAuth();
  const queryClient = useQueryClient();
  const { showSnackbar: internalShowSnackbar } = useSnackbar();
  
  // Usar la función externa si se proporciona, sino usar la interna
  const showSnackbar = externalShowSnackbar || internalShowSnackbar;
  
  // ===== QUERIES =====
  
  /**
   * Estado actual de caja chica del usuario
   */
  const {
    data: estadoCajaChica,
    isLoading: loadingEstadoCaja,
    error: errorEstadoCaja,
    refetch: refetchEstadoCaja
  } = useQuery({
    queryKey: ['usuario-caja-chica', 'estado', usuario?.usuario_id],
    queryFn: () => gastosService.obtenerEstadoCajaChica(),
    enabled: !!usuario?.usuario_id,
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Refrescar cada minuto para monitorear el estado
  });
  
  /**
   * Historial de rendiciones del usuario
   */
  const {
    data: historialRendiciones,
    isLoading: loadingHistorial,
    error: errorHistorial,
    refetch: refetchHistorial
  } = useQuery({
    queryKey: ['usuario-caja-chica', 'rendiciones', usuario?.usuario_id],
    queryFn: () => gastosService.obtenerHistorialRendiciones(),
    enabled: !!usuario?.usuario_id,
    staleTime: 300000, // 5 minutos
  });
  
  /**
   * Saldo disponible del usuario
   */
  const {
    data: saldoDisponible,
    isLoading: loadingSaldo
  } = useQuery({
    queryKey: ['usuario-caja-chica', 'saldo', usuario?.usuario_id],
    queryFn: () => gastosService.obtenerSaldoDisponible(),
    enabled: !!usuario?.usuario_id,
    staleTime: 30000,
  });
  
  // ===== MUTATIONS =====
  
  /**
   * Reiniciar ciclo completo (genera nómina y reinicia)
   */
  const reiniciarCicloCompletoMutation = useMutation({
    mutationFn: () => gastosService.reiniciarCiclo(),
    onSuccess: (data: unknown) => {
      const response = data as { data?: { nomina_generada?: { id?: string } } };
      const nominaId = response?.data?.nomina_generada?.id || "nueva nómina";
      showSnackbar(
        `✅ Ciclo reiniciado exitosamente. Nómina generada: ${nominaId}`, 
        "success"
      );
      // Invalidar todo el caché relacionado con gastos y caja chica
      queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica'] });
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      queryClient.invalidateQueries({ queryKey: ['caja-chica'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-monetarias'] });
      queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica-estado'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['usuario'] });
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al reiniciar ciclo";
      showSnackbar(`❌ ${message}`, "error");
    }
  });
  
  // ===== COMPUTED VALUES =====
  
  /**
   * Información del usuario actual
   */
  const usuarioInfo = {
    id: estadoCajaChica?.usuarioId || usuario?.usuario_id || 0,
    email: estadoCajaChica?.email || usuario?.email || "",
    tieneCajaChica: estadoCajaChica?.tieneCajaChica || false,
  };
  
  /**
   * Estado computado de la caja chica
   */
  const estadoComputado = estadoCajaChica ? {
    montoFijo: parseFloat(estadoCajaChica.montoFijo),
    montoActual: parseFloat(estadoCajaChica.montoActual),
    limiteMinimo: parseFloat(estadoCajaChica.limiteMinimo),
    saldoDisponible: saldoDisponible?.saldoDisponible || 0,
    puedeCrearGasto: parseFloat(estadoCajaChica.montoActual) > parseFloat(estadoCajaChica.limiteMinimo),
  } : null;
  
  // ===== ACTIONS =====
  
  const reiniciarCicloCompleto = () => {
    reiniciarCicloCompletoMutation.mutate();
  };
  
  const verificarSaldo = (monto: number) => {
    const saldo = saldoDisponible?.saldoDisponible || 0;
    return saldo >= monto;
  };
  
  // ===== RETURN =====
  
  return {
    // Estado
    estadoCajaChica: estadoComputado,
    historialRendiciones: historialRendiciones?.rendiciones || [],
    saldoDisponible: saldoDisponible?.saldoDisponible || 0,
    usuarioInfo,
    
    // Loading states
    loadingEstadoCaja,
    loadingHistorial,
    loadingSaldo,
    loadingReiniciarCicloCompleto: reiniciarCicloCompletoMutation.isPending,
    
    // Error states
    errorEstadoCaja,
    errorHistorial,
    
    // Actions
    reiniciarCicloCompleto,
    verificarSaldo,
    
    // Refetch functions
    refetchEstadoCaja,
    refetchHistorial,
  };
}