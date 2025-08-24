import { AxiosError } from "axios";
import { createAuthenticatedApi, handleApiError, checkAuthentication } from "@/utils/apiConfig";

// Instancia de API configurada para rinde gastos
const rindeGastosApi = createAuthenticatedApi();

export interface Gasto {
  id: string;
  descripcion: string;
  monto: string; // Backend devuelve string, no number
  fecha: string; // ISO string, no Date object
  categoria: string;
  comprobante: string | null; // Backend usa 'comprobante', no 'comprobante_url'
  observaciones: string | null;
  fechaCreacion: string; // Backend usa 'fechaCreacion', no 'created_at'
  nombreCuentaContable: string; // Nombre de la cuenta contable
  nombreUsuario: string; // Nombre del usuario
  nombreLocal: string; // Nombre del local
}

// Interfaz para la respuesta nested del backend (documentación original)
export interface CajaChicaEstadoNested {
  local: {
    id: number;
    nombre: string;
  };
  caja_chica: {
    monto_fijo: number;
    monto_actual: number;
    monto_utilizado: number;
    limite_minimo: number;
    porcentaje_utilizado: number;
    estado: 'normal' | 'alerta' | 'critico';
  };
  rendicion_actual: {
    id: string;
    fecha_inicio: string;
    cantidad_gastos: number;
    monto_total_gastos: number;
    estado: string;
    dias_transcurridos: number;
  };
  alertas: {
    requiere_reembolso: boolean;
    cerca_limite: boolean;
    puede_generar_nomina: boolean;
    mensajes: string[];
  };
  proximo_reembolso?: {
    monto_estimado: number;
    fecha_estimada: string;
  };
}

// Interfaz para la respuesta flat del backend (formato real actual)
export interface CajaChicaEstado {
  localId: number;
  nombreLocal: string;
  montoFijo: number;
  montoActual: number;
  montoUtilizado: number;
  limiteMinimo: number;
  estadoAlerta: 'normal' | 'alerta' | 'critico';
  requiereReembolso: boolean;
  fechaUltimoReembolso?: string;
  rendicionActual: {
    id: string;
    fechaInicio: string;
    gastosRegistrados: number;
    montoTotalGastos: number;
  };
}

export interface RendicionGasto {
  nomina_id?: string;
  rendicion_id: string;
  fecha_generacion?: string;
  fecha_reembolso?: string;
  monto_total_rendicion: number;
  monto_reembolso?: number;
  cantidad_gastos: number;
  estado: 'generada' | 'enviada' | 'aprobada' | 'reembolsada' | 'ciclo_cerrado';
  comprobante_reembolso?: string;
  observaciones_generacion?: string;
  observaciones_reembolso?: string;
  periodo: {
    fecha_inicio: string;
    fecha_fin?: string;
    dias_duracion?: number;
  };
}

export interface NominaRendicion {
  nominaId: string;
  localId: number;
  nombreLocal: string;
  fechaGeneracion: string;
  montoTotalRendicion: number;
  cantidadGastos: number;
  estado: 'generada' | 'enviada' | 'aprobada' | 'reembolsada';
  observaciones?: string;
  proximoReembolso?: {
    montoEsperado: number;
    fechaEstimada: string;
  };
  // Para reembolso
  montoReembolso?: number;
  fechaReembolso?: string;
  comprobanteReembolso?: string;
  puedeReiniciarCiclo?: boolean;
}

export interface CrearGastoRequest {
  descripcion: string;
  monto: number;
  fecha: string;
  categoria: string;
  cuenta_contable_id: string; // Ahora es string según documentación
  comprobante_url?: string;
  observaciones?: string;
}

export interface EstadisticasMonetarias {
  cuenta_contable_id: string;
  cuenta_contable_nombre: string;
  categoria: string;
  totalGasto: string;     // Backend devuelve string
  cantidadGastos: string; // Backend devuelve string  
  porcentaje: string;     // Backend devuelve string
}

// Nuevas interfaces para aprovechar funcionalidades profesionales del backend
export interface FiltrosGastos {
  pagina?: number;
  limite?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  categoria?: string;
  ordenPor?: 'fecha' | 'monto' | 'created_at';
  orden?: 'ASC' | 'DESC';
}

export interface PaginacionResponse<T> {
  data: T;
  meta?: {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
    hayMasPaginas: boolean;
  };
  filtros_aplicados?: unknown;
  timestamp?: string;
}

export interface CuentaContable {
  id: string; // Según documentación actualizada
  nombre: string;
  categoria: 'ACTIVOS' | 'GASTOS_OPERACIONALES' | 'GASTOS_GENERALES' | 'OTROS';
  es_mas_utilizada?: boolean; // Según documentación
  created_at?: string;
}

class RindeGastosService {
  
  // ===== GASTOS (CON LOCALIZACIÓN DINÁMICA) =====
  
  /**
   * Crear nuevo gasto - se asocia automáticamente al local del usuario autenticado
   * Funciona igual que el sistema de bodega-stock
   */
  async crearGasto(gasto: CrearGastoRequest): Promise<Gasto> {
    try {
      checkAuthentication();
      const response = await rindeGastosApi.post('/gastos', gasto);
      return response.data.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Obtener gastos - filtrado automáticamente por local del usuario
   * Solo verá gastos de su propio local, todos los gastos se descuentan inmediatamente
   * Ahora con soporte para paginación y filtros profesionales
   */
  async obtenerGastos(filtros: FiltrosGastos = {}): Promise<PaginacionResponse<Gasto[]>> {
    try {
      checkAuthentication();
      const params = new URLSearchParams();
      
      if (filtros.pagina) params.append('pagina', filtros.pagina.toString());
      if (filtros.limite) params.append('limite', filtros.limite.toString());
      if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);
      if (filtros.categoria) params.append('categoria', filtros.categoria);
      if (filtros.ordenPor) params.append('ordenPor', filtros.ordenPor);
      if (filtros.orden) params.append('orden', filtros.orden);
      
      const queryString = params.toString();
      const url = queryString ? `/gastos?${queryString}` : '/gastos';
      
      const response = await rindeGastosApi.get(url);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Obtener gasto por ID - solo si pertenece al local del usuario
   */
  async obtenerGastoPorId(id: string): Promise<Gasto> {
    const response = await rindeGastosApi.get(`/gastos/${id}`);
    return response.data.data;
  }
  
  /**
   * Eliminar gasto - solo si pertenece al local del usuario
   */
  async eliminarGasto(id: string): Promise<void> {
    await rindeGastosApi.delete(`/gastos/${id}`);
  }
  
  // ===== CAJA CHICA =====
  
  /**
   * Obtener estado actual de caja chica del local del usuario
   */
  async obtenerEstadoCajaChica(): Promise<CajaChicaEstado> {
    const response = await rindeGastosApi.get('/caja-chica/estado');
    return response.data.data;
  }
  
  /**
   * Generar nómina de rendición cuando se llega al límite mínimo
   */
  async generarNominaRendicion(observaciones?: string): Promise<NominaRendicion> {
    const response = await rindeGastosApi.post('/caja-chica/generar-nomina', {
      observaciones
    });
    return response.data.data;
  }
  
  /**
   * Registrar reembolso de casa matriz (NO reinicia automáticamente el ciclo)
   */
  async registrarReembolso(
    nominaId: string, 
    montoReembolso: number, 
    comprobanteReembolso?: string
  ): Promise<NominaRendicion> {
    const response = await rindeGastosApi.post('/caja-chica/registrar-reembolso', {
      nominaId,
      montoReembolso,
      comprobanteReembolso
    });
    return response.data.data;
  }

  /**
   * Reiniciar ciclo de caja chica manualmente (requiere reembolso registrado)
   */
  async reiniciarCiclo(
    nominaId: string,
    observaciones?: string
  ): Promise<CajaChicaEstado> {
    const response = await rindeGastosApi.post('/caja-chica/reiniciar-ciclo', {
      nominaId,
      observaciones
    });
    return response.data.data;
  }

  /**
   * Reiniciar ciclo completo de caja chica (automático)
   */
  async reiniciarCicloCompleto(): Promise<{
    success: boolean;
    localId: number;
    nombreLocal: string;
    procesoCompleto: {
      paso1_nomina_generada: {
        nominaId: string;
        montoTotalRendicion: number;
        cantidadGastos: number;
        fechaGeneracion: string;
      };
      paso2_reembolso_registrado: {
        fechaReembolso: string;
        comprobanteReembolso: string;
      };
      paso3_ciclo_reiniciado: {
        nuevaRendicionId: string;
        montoInicialNuevo: number;
        fechaInicio: string;
      };
    };
    estadoFinal: {
      montoFijo: number;
      montoActual: number;
      saldoDisponible: number;
      requiereReembolso: boolean;
      cicloActivo: boolean;
    };
    mensaje: string;
    timestamp: string;
  }> {
    const response = await rindeGastosApi.post('/caja-chica/reiniciar-ciclo-completo');
    return response.data.data;
  }
  
  /**
   * Obtener historial de rendiciones del local
   * Ahora con soporte para paginación
   */
  async obtenerHistorialRendiciones(pagina = 1, limite = 10): Promise<PaginacionResponse<{rendiciones: RendicionGasto[]}>> {
    const params = new URLSearchParams({
      pagina: pagina.toString(),
      limite: limite.toString()
    });
    
    const response = await rindeGastosApi.get(`/caja-chica/rendiciones?${params}`);
    return response.data;
  }
  
  // ===== ESTADÍSTICAS (POR LOCAL) =====
  
  /**
   * Obtener estadísticas monetarias por categoría del local del usuario
   * Ahora con soporte para filtros de fecha
   */
  async obtenerEstadisticasMonetarias(fechaDesde?: string, fechaHasta?: string): Promise<{
    data: EstadisticasMonetarias[];
    meta: {
      totalGeneral: number;
      totalGastos: number;
    };
  }> {
    const params = new URLSearchParams();
    if (fechaDesde) params.append('fechaDesde', fechaDesde);
    if (fechaHasta) params.append('fechaHasta', fechaHasta);
    
    const queryString = params.toString();
    const url = queryString 
      ? `/estadisticas/categorias-monetarias?${queryString}`
      : '/estadisticas/categorias-monetarias';
    
    const response = await rindeGastosApi.get(url);
    return response.data;
  }
  
  // ===== CUENTAS CONTABLES =====
  
  /**
   * Obtener todas las cuentas contables
   */
  async obtenerCuentasContables(): Promise<CuentaContable[]> {
    try {
      checkAuthentication();
      const response = await rindeGastosApi.get('/cuentas-contables');
      return response.data.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Obtener cuentas más utilizadas
   */
  async obtenerCuentasMasUtilizadas(limite = 4): Promise<CuentaContable[]> {
    try {
      checkAuthentication();
      const params = new URLSearchParams({ limite: limite.toString() });
      const response = await rindeGastosApi.get(`/cuentas-contables/mas-utilizadas?${params}`);
      return response.data.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
  
  // ===== UTILIDADES =====
  
  /**
   * Verificar si se puede crear un gasto según el saldo disponible
   */
  async verificarSaldoDisponible(monto: number): Promise<boolean> {
    const estadoCaja = await this.obtenerEstadoCajaChica();
    return estadoCaja.montoActual >= monto;
  }
  
  /**
   * Obtener alerta de estado de caja chica
   * Ahora aprovecha las alertas que vienen del backend
   */
  async obtenerAlertaCajaChica(): Promise<{
    tieneAlerta: boolean;
    mensaje: string;
    tipo: 'info' | 'warning' | 'error';
    alertasBackend?: {
      requiere_reembolso: boolean;
      cerca_limite: boolean;
      puede_generar_nomina: boolean;
      mensajes: string[];
    };
  }> {
    const estadoCaja = await this.obtenerEstadoCajaChica();
    // El backend ahora devuelve datos en formato flat
    
    // Evaluar estado basado en la respuesta flat del backend
    
    if (estadoCaja.estadoAlerta === 'critico') {
      return {
        tieneAlerta: true,
        mensaje: `Caja chica en límite crítico: $${estadoCaja.montoActual.toLocaleString()}. Debe generar nómina de rendición.`,
        tipo: 'error',
        alertasBackend: {
          requiere_reembolso: estadoCaja.requiereReembolso,
          cerca_limite: true,
          puede_generar_nomina: true,
          mensajes: [`Caja chica crítica`]
        }
      };
    }
    
    if (estadoCaja.estadoAlerta === 'alerta') {
      return {
        tieneAlerta: true,
        mensaje: `Caja chica cerca del límite: $${estadoCaja.montoActual.toLocaleString()}. Considere generar rendición pronto.`,
        tipo: 'warning',
        alertasBackend: {
          requiere_reembolso: estadoCaja.requiereReembolso,
          cerca_limite: true,
          puede_generar_nomina: true,
          mensajes: [`Caja chica en alerta`]
        }
      };
    }
    
    return {
      tieneAlerta: false,
      mensaje: `Caja chica en buen estado: $${estadoCaja.montoActual.toLocaleString()}`,
      tipo: 'info',
      alertasBackend: {
        requiere_reembolso: estadoCaja.requiereReembolso,
        cerca_limite: false,
        puede_generar_nomina: false,
        mensajes: []
      }
    };
  }
}

export const rindeGastosService = new RindeGastosService();

// Hook personalizado para usar el servicio con React Query
export const useRindeGastosService = () => {
  return {
    // Gastos
    crearGasto: rindeGastosService.crearGasto.bind(rindeGastosService),
    obtenerGastos: rindeGastosService.obtenerGastos.bind(rindeGastosService),
    obtenerGastoPorId: rindeGastosService.obtenerGastoPorId.bind(rindeGastosService),
    eliminarGasto: rindeGastosService.eliminarGasto.bind(rindeGastosService),
    
    // Caja Chica
    obtenerEstadoCajaChica: rindeGastosService.obtenerEstadoCajaChica.bind(rindeGastosService),
    generarNominaRendicion: rindeGastosService.generarNominaRendicion.bind(rindeGastosService),
    registrarReembolso: rindeGastosService.registrarReembolso.bind(rindeGastosService),
    reiniciarCiclo: rindeGastosService.reiniciarCiclo.bind(rindeGastosService),
    obtenerHistorialRendiciones: rindeGastosService.obtenerHistorialRendiciones.bind(rindeGastosService),
    
    // Estadísticas
    obtenerEstadisticasMonetarias: rindeGastosService.obtenerEstadisticasMonetarias.bind(rindeGastosService),
    
    // Cuentas Contables
    obtenerCuentasContables: rindeGastosService.obtenerCuentasContables.bind(rindeGastosService),
    obtenerCuentasMasUtilizadas: rindeGastosService.obtenerCuentasMasUtilizadas.bind(rindeGastosService),
    
    // Utilidades
    verificarSaldoDisponible: rindeGastosService.verificarSaldoDisponible.bind(rindeGastosService),
    obtenerAlertaCajaChica: rindeGastosService.obtenerAlertaCajaChica.bind(rindeGastosService),
  };
};