"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { rindeGastosService } from "@/services/rindeGastosService";
import { useSnackbar } from "@/hooks/useSnackbar";

interface UseCajaChicaOptions {
  showSnackbar?: (message: string, severity: "success" | "error" | "info" | "warning") => void;
}

/**
 * Hook personalizado para manejar la caja chica con localización dinámica
 * Funciona igual que useStock - automáticamente filtra por el local del usuario autenticado
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
   * Estado actual de caja chica del local del usuario
   */
  const {
    data: estadoCajaChica,
    isLoading: loadingEstadoCaja,
    error: errorEstadoCaja,
    refetch: refetchEstadoCaja
  } = useQuery({
    queryKey: ['caja-chica', 'estado', usuario?.id_local],
    queryFn: () => rindeGastosService.obtenerEstadoCajaChica(),
    enabled: !!usuario?.id_local,
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Refrescar cada minuto para monitorear el estado
  });
  
  /**
   * Historial de rendiciones del local
   */
  const {
    data: historialRendiciones,
    isLoading: loadingHistorial,
    error: errorHistorial,
    refetch: refetchHistorial
  } = useQuery({
    queryKey: ['caja-chica', 'rendiciones', usuario?.id_local],
    queryFn: () => rindeGastosService.obtenerHistorialRendiciones(),
    enabled: !!usuario?.id_local,
    staleTime: 300000, // 5 minutos
  });
  
  /**
   * Alerta de estado de caja chica
   */
  const {
    data: alertaCajaChica,
    isLoading: loadingAlerta
  } = useQuery({
    queryKey: ['caja-chica', 'alerta', usuario?.id_local],
    queryFn: () => rindeGastosService.obtenerAlertaCajaChica(),
    enabled: !!usuario?.id_local && !!estadoCajaChica,
    staleTime: 30000,
  });
  
  // ===== MUTATIONS =====
  
  /**
   * Generar nómina de rendición
   */
  const generarNominaMutation = useMutation({
    mutationFn: (observaciones?: string) => 
      rindeGastosService.generarNominaRendicion(observaciones),
    onSuccess: (data: unknown) => {
      const nominaId = (data as { nominaId?: string; id?: string })?.nominaId || (data as { nominaId?: string; id?: string })?.id || "nueva nómina";
      showSnackbar(
        `✅ Nómina de rendición generada exitosamente: ${nominaId}`, 
        "success"
      );
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['caja-chica'] });
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al generar nómina de rendición";
      showSnackbar(`❌ ${message}`, "error");
    }
  });
  
  /**
   * Registrar reembolso de casa matriz (NO reinicia automáticamente)
   */
  const registrarReembolsoMutation = useMutation({
    mutationFn: ({ 
      nominaId, 
      montoReembolso, 
      comprobanteReembolso 
    }: { 
      nominaId: string; 
      montoReembolso: number; 
      comprobanteReembolso?: string 
    }) => rindeGastosService.registrarReembolso(nominaId, montoReembolso, comprobanteReembolso),
    onSuccess: () => {
      showSnackbar(
        `✅ Reembolso registrado exitosamente. Ahora puede reiniciar el ciclo.`, 
        "success"
      );
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['caja-chica'] });
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al registrar reembolso";
      showSnackbar(`❌ ${message}`, "error");
    }
  });

  /**
   * Reiniciar ciclo de caja chica manualmente
   */
  const reiniciarCicloMutation = useMutation({
    mutationFn: ({ 
      nominaId, 
      observaciones 
    }: { 
      nominaId: string; 
      observaciones?: string 
    }) => rindeGastosService.reiniciarCiclo(nominaId, observaciones),
    onSuccess: (data: unknown) => {
      const montoActual = (data as { montoActual?: number; caja_chica?: { monto_actual?: number } })?.montoActual || (data as { montoActual?: number; caja_chica?: { monto_actual?: number } })?.caja_chica?.monto_actual || 0;
      showSnackbar(
        `✅ Ciclo reiniciado exitosamente. Nueva caja chica: $${montoActual.toLocaleString()}`, 
        "success"
      );
      // Invalidar todas las queries relacionadas para refrescar el estado
      queryClient.invalidateQueries({ queryKey: ['caja-chica'] });
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas'] });
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al reiniciar ciclo";
      showSnackbar(`❌ ${message}`, "error");
    }
  });

  /**
   * Reiniciar ciclo completo de caja chica (automático)
   */
  const reiniciarCicloCompletoMutation = useMutation({
    mutationFn: () => rindeGastosService.reiniciarCicloCompleto(),
    onSuccess: (data: unknown) => {
      showSnackbar(`✅ ${(data as { mensaje?: string })?.mensaje || "Ciclo de caja chica reiniciado completamente"}`, "success");
      // Invalidar todas las queries relacionadas para refrescar el estado
      queryClient.invalidateQueries({ queryKey: ['caja-chica'] });
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-monetarias'] });
      refetchEstadoCaja();
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || "Error al reiniciar ciclo completo";
      showSnackbar(`❌ ${message}`, "error");
    }
  });
  
  /**
   * Verificar si se puede aprobar un gasto
   */
  const verificarSaldoMutation = useMutation({
    mutationFn: (monto: number) => rindeGastosService.verificarSaldoDisponible(monto),
  });
  
  // ===== COMPUTED VALUES =====
  
  /**
   * Información del local actual
   * Nota: En producción, el nombre se obtiene dinámicamente del backend via JOIN con tabla locales
   */
  const localInfo = {
    id: estadoCajaChica?.localId || usuario?.id_local || 0,
    nombre: estadoCajaChica?.nombreLocal || "Local no encontrado",
  };
  
  /**
   * Estado computado de la caja chica
   * El backend ya devuelve los datos en el formato correcto, solo los pasamos
   */
  const estadoComputado = estadoCajaChica || null;
  
  // ===== HELPER FUNCTIONS =====
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function estimarDiasHastaLimite(estado: unknown): number {
    // El backend ya devuelve los datos en formato flat
    const estadoTyped = estado as {
      montoUtilizado?: number;
      montoActual?: number;
      limiteMinimo?: number;
      rendicionActual?: {
        gastosRegistrados?: number;
        fechaInicio?: string;
      };
    };
    
    const montoUtilizado = estadoTyped.montoUtilizado || 0;
    const montoActual = estadoTyped.montoActual || 0;
    const limiteMinimo = estadoTyped.limiteMinimo || 0;
    const gastosRegistrados = estadoTyped.rendicionActual?.gastosRegistrados || 0;
    
    if (gastosRegistrados === 0 || montoUtilizado === 0) {
      return 999; // Sin gastos, no se puede estimar
    }
    
    const fechaInicio = estadoTyped.rendicionActual?.fechaInicio;
    if (!fechaInicio) return 999;
    
    const diasTranscurridos = Math.max(1, 
      Math.ceil((Date.now() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24))
    );
    
    const promedioGastoDiario = montoUtilizado / diasTranscurridos;
    
    if (promedioGastoDiario <= 0) return 999;
    
    const montoDisponible = montoActual - limiteMinimo;
    return Math.floor(montoDisponible / promedioGastoDiario);
  }
  
  // ===== ACTIONS =====
  
  const generarNomina = (observaciones?: string) => {
    generarNominaMutation.mutate(observaciones);
  };
  
  const registrarReembolso = (
    nominaId: string, 
    montoReembolso: number, 
    comprobanteReembolso?: string
  ) => {
    registrarReembolsoMutation.mutate({ 
      nominaId, 
      montoReembolso, 
      comprobanteReembolso 
    });
  };

  const reiniciarCiclo = (
    nominaId: string,
    observaciones?: string
  ) => {
    reiniciarCicloMutation.mutate({
      nominaId,
      observaciones
    });
  };

  const reiniciarCicloCompleto = () => {
    reiniciarCicloCompletoMutation.mutate();
  };
  
  const verificarSaldo = (monto: number) => {
    return verificarSaldoMutation.mutateAsync(monto);
  };
  
  const refetchAll = () => {
    refetchEstadoCaja();
    refetchHistorial();
  };
  
  return {
    // Data
    estadoCajaChica: estadoComputado,
    historialRendiciones,
    alertaCajaChica,
    localInfo,
    
    // Loading states
    loadingEstadoCaja,
    loadingHistorial,
    loadingAlerta,
    loadingGenerarNomina: generarNominaMutation.isPending,
    loadingRegistrarReembolso: registrarReembolsoMutation.isPending,
    loadingReiniciarCiclo: reiniciarCicloMutation.isPending,
    loadingReiniciarCicloCompleto: reiniciarCicloCompletoMutation.isPending,
    loadingVerificarSaldo: verificarSaldoMutation.isPending,
    
    // Error states
    errorEstadoCaja,
    errorHistorial,
    
    // Actions
    generarNomina,
    registrarReembolso,
    reiniciarCiclo,
    reiniciarCicloCompleto,
    verificarSaldo,
    refetchAll,
    refetchEstadoCaja,
    refetchHistorial,
  };
}
