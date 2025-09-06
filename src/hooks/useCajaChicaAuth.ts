import { useAuth } from "./useAuth";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { gastosService } from "@/services/gastosService";

export function useCajaChicaAuth() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  // Query para obtener estado actualizado de caja chica desde el backend
  const {
    data: estadoCajaChicaBackend,
    isLoading: loadingEstadoCaja,
    error: errorEstadoCaja,
    refetch: refetchEstadoCajaBackend
  } = useQuery({
    queryKey: ['usuario-caja-chica-estado', usuario?.usuario_id],
    queryFn: () => gastosService.obtenerEstadoCajaChica(),
    enabled: !!usuario?.usuario_id,
    staleTime: 30 * 1000, // 30 segundos
    refetchOnWindowFocus: true,
  });

  // Usar datos del backend si están disponibles, sino usar fallback seguro
  const estadoCajaChica = estadoCajaChicaBackend || {
    usuarioId: usuario?.usuario_id || 0,
    nombre: usuario?.nombre || "Usuario",
    email: usuario?.email || "",
    tieneCajaChica: false, // No asumir que tiene caja chica por defecto
    montoFijo: 0,
    montoActual: 0,
    limiteMinimo: 0,
    fechaUltimoReembolso: null,
  };

  // Autorización basada en datos del backend
  const autorizacion = {
    usuarioId: usuario?.usuario_id || 0,
    tieneCajaChica: estadoCajaChicaBackend?.tieneCajaChica || false // Usar datos reales del backend
  };

  // Saldo disponible usando datos actualizados del backend
  const saldoDisponible = {
    saldoDisponible: parseFloat(String(estadoCajaChica.montoActual)) || 0,
    montoFijo: parseFloat(String(estadoCajaChica.montoFijo)) || 0,
    gastosRealizados: (parseFloat(String(estadoCajaChica.montoFijo)) || 0) - (parseFloat(String(estadoCajaChica.montoActual)) || 0),
    limiteMinimo: parseFloat(String(estadoCajaChica.limiteMinimo)) || 0,
    puedeCrearGasto: (parseFloat(String(estadoCajaChica.montoActual)) || 0) > (parseFloat(String(estadoCajaChica.limiteMinimo)) || 0),
    mensaje: (parseFloat(String(estadoCajaChica.montoActual)) || 0) > (parseFloat(String(estadoCajaChica.limiteMinimo)) || 0) 
      ? "Saldo disponible para crear gastos" 
      : "Saldo insuficiente para crear gastos"
  };

  // Función para refrescar datos del usuario (JWT)
  const refetchAutorizacion = () => {
    // Invalidar caché de autenticación para forzar refresh del JWT
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    queryClient.invalidateQueries({ queryKey: ['usuario'] });
  };

  const refetchEstadoCaja = () => {
    // Invalidar caché de caja chica
    queryClient.invalidateQueries({ queryKey: ['caja-chica'] });
    queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica'] });
    queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica-estado'] });
    // Refrescar datos del backend
    refetchEstadoCajaBackend();
    // También refrescar datos del usuario
    refetchAutorizacion();
  };

  const refetchSaldo = () => {
    // Invalidar caché de saldo
    queryClient.invalidateQueries({ queryKey: ['saldo'] });
    queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica'] });
    queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica-estado'] });
    // Refrescar datos del backend
    refetchEstadoCajaBackend();
    // También refrescar datos del usuario
    refetchAutorizacion();
  };

  return {
    autorizacion,
    estadoCajaChica,
    saldoDisponible,
    loadingAutorizacion: loadingEstadoCaja, // Usar el loading real del backend
    loadingEstadoCaja,
    loadingSaldo: loadingEstadoCaja, // Mismo loading que estado
    errorAutorizacion: errorEstadoCaja, // Usar el error real del backend
    errorEstadoCaja,
    errorSaldo: errorEstadoCaja, // Mismo error que estado
    refetchAutorizacion,
    refetchEstadoCaja,
    refetchSaldo
  };
}