import { AxiosError } from "axios";
import { createAuthenticatedApi, handleApiError, checkAuthentication } from "@/utils/apiConfig";

// Instancia de API configurada para gastos
const gastosApi = createAuthenticatedApi();

// ===== INTERFACES DEL SISTEMA NUEVO =====

export interface Gasto {
  id: string;
  descripcion: string;
  monto: string;              // Backend devuelve como string
  fecha: string;
  categoria: string;
  local_id: number;           // Local del usuario
  local_asignado_id: number;  // Local asignado al gasto
  rendicion_id: string;       // Vinculado a rendiciones_usuarios
  usuario_id: number;
  created_at: string;
  cuenta_contable_id?: string;
  nombreCuentaContable?: string;  // Nombre de la cuenta contable desde el backend
  nombreLocalAsignado?: string;   // Nombre del local asignado desde el backend
  comprobante_url?: string;
  observaciones?: string;
}

export interface CrearGastoRequest {
  descripcion: string;
  monto: number;
  fecha: string;
  categoria: string;
  local_asignado_id: number;  // Campo clave: local asignado
  cuenta_contable_id?: string;
  observaciones?: string;
}

export interface GastosResponse {
  success: boolean;
  data: Gasto[];
  meta: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
    tieneSiguiente: boolean;
    tieneAnterior: boolean;
  };
}

export interface UsuarioCajaChica {
  usuarioId: number;
  email: string;
  nombre: string;
  tieneCajaChica: boolean;
  montoFijo: string;
  montoActual: string;
  montoUtilizado: string;
  limiteMinimo: string;
  fechaUltimoReembolso?: string;
  estadoAlerta: string;
  requiereReembolso: boolean;
  rendicionId: string;
  rendicionFechaInicio: string;
  rendicionGastosRegistrados: number;
  rendicionMontoTotalGastos: string;
}

export interface RendicionUsuario {
  id: string;
  usuario_id: number;         // Sistema basado en usuarios
  monto_inicial: number;
  monto_final: number;
  cantidad_gastos: number;
  estado: 'activa' | 'cerrada';
  fecha_inicio: string;
  fecha_cierre?: string;
  created_at: string;
}

export interface EstadisticasCategoria {
  categoria: string;
  totalGasto: string;
  cantidadGastos: string;
  porcentaje: string;
  cuenta_contable_id: string;
  cuenta_contable_nombre: string;
}

export interface EstadisticasResponse {
  success: boolean;
  data: EstadisticasCategoria[];
  meta: {
    totalGeneral: number;
    totalGastos: number;
  };
}

export interface ReiniciarCicloResponse {
  success: boolean;
  message: string;
  data: {
    rendicion_anterior: RendicionUsuario;
    rendicion_nueva: RendicionUsuario;
    nomina_generada: {
      id: string;
      monto_total: number;
      cantidad_gastos: number;
    };
    usuario_actualizado: UsuarioCajaChica;
  };
}

// ===== SERVICIO DE GASTOS =====

class GastosService {
  
  /**
   * Crear nuevo gasto - sistema basado en usuarios
   */
  async crearGasto(gasto: CrearGastoRequest): Promise<Gasto> {
    try {
      checkAuthentication();
      const response = await gastosApi.post('/gastos', gasto);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Obtener gastos del usuario - sistema basado en usuarios
   */
  async obtenerGastos(params: {
    pagina?: number;
    limite?: number;
    fechaDesde?: string;
    fechaHasta?: string;
    categoria?: string;
    ordenPor?: string;
    orden?: 'ASC' | 'DESC';
  } = {}): Promise<GastosResponse> {
    try {
      checkAuthentication();
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await gastosApi.get(`/gastos?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Obtener gasto específico
   */
  async obtenerGasto(id: string): Promise<Gasto> {
    try {
      checkAuthentication();
      const response = await gastosApi.get(`/gastos/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Eliminar gasto
   */
  async eliminarGasto(id: string): Promise<void> {
    try {
      checkAuthentication();
      await gastosApi.delete(`/gastos/${id}`);
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Obtener estadísticas por categoría
   */
  async obtenerEstadisticas(): Promise<EstadisticasResponse> {
    try {
      checkAuthentication();
      const response = await gastosApi.get('/estadisticas/categorias-monetarias');
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Reiniciar ciclo de caja chica del usuario
   */
  async reiniciarCiclo(): Promise<ReiniciarCicloResponse> {
    try {
      checkAuthentication();
      const response = await gastosApi.post('/usuario-caja-chica/reiniciar-ciclo-completo');
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Obtener estado de caja chica del usuario
   */
  async obtenerEstadoCajaChica(): Promise<UsuarioCajaChica> {
    try {
      checkAuthentication();
      const response = await gastosApi.get('/usuario-caja-chica/estado');
      return response.data.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Obtener saldo disponible del usuario
   */
  async obtenerSaldoDisponible(): Promise<{ saldoDisponible: number }> {
    try {
      checkAuthentication();
      const response = await gastosApi.get('/usuario-caja-chica/saldo');
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Obtener historial de rendiciones del usuario
   */
  async obtenerHistorialRendiciones(pagina = 1, limite = 10): Promise<{
    rendiciones: RendicionUsuario[];
    meta: {
      pagina: number;
      limite: number;
      total: number;
      totalPaginas: number;
    };
  }> {
    try {
      checkAuthentication();
      const response = await gastosApi.get(`/usuario-caja-chica/historial?pagina=${pagina}&limite=${limite}`);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
}

// Exportar instancia del servicio
export const gastosService = new GastosService();
export default gastosService;
