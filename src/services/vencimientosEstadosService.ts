import axios from 'axios';
import { 
  ActualizarEstadoVencimientoRequest, 
  VencimientoEstadosResponse
} from '@/types/vencimientos';
import { ENV } from '@/config/env';
const API_BASE_URL = ENV.API_URL;
// Usar la variable de entorno como los otros servicios

// Helper para manejar errores de axios
const handleAxiosError = (error: unknown): VencimientoEstadosResponse => {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data as VencimientoEstadosResponse;
  }
  return {
    success: false,
    error: 'Error de conexión'
  };
};

class VencimientosEstadosService {
  // Obtener información del usuario actual
  private async obtenerUsuarioActual(): Promise<{ id: number; nombre: string } | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api-beta/me`, {
        withCredentials: true, // Importante para las cookies de autenticación
      });
      
      // La estructura correcta es: { user: { id_auth_user, usuario_id, nombre, ... } }
      const userData = response.data;
      
      if (userData.user && userData.user.usuario_id && userData.user.nombre) {
        const usuario = { 
          id: userData.user.usuario_id, 
          nombre: userData.user.nombre 
        };
        return usuario;
      }
      
      return null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  }

  // Actualizar estado de un vencimiento
  async actualizarEstado(request: ActualizarEstadoVencimientoRequest): Promise<VencimientoEstadosResponse> {
    try {
      // Obtener información del usuario actual
      const usuario = await this.obtenerUsuarioActual();
      
      const requestBody = {
        estado: request.estado,
        precio_rebaja: request.precio_rebaja,
        cantidad_afectada: request.cantidad_afectada,
        motivo: request.motivo,
        usuario_id: usuario?.id,
        usuario_nombre: usuario?.nombre
      };
      
      const response = await axios.post(`${API_BASE_URL}/api-beta/control-vencimientos/${request.vencimiento_id}/estados`, requestBody, {
        withCredentials: true, // Agregar credenciales para autenticación
      });
      return response.data;
    } catch (error) {
      console.error('Error en actualizarEstado:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      return handleAxiosError(error);
    }
  }

  // Obtener historial de estados de un vencimiento
  async obtenerHistorialEstados(vencimientoId: number): Promise<VencimientoEstadosResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api-beta/control-vencimientos/${vencimientoId}/estados`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  // Obtener estado actual de un vencimiento
  async obtenerEstadoActual(vencimientoId: number): Promise<VencimientoEstadosResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api-beta/control-vencimientos/${vencimientoId}/estados?actual=true`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  }

  // Obtener estadísticas de estados
  async obtenerEstadisticasEstados(): Promise<{
    success: boolean;
    data?: {
      total_vencimientos: number;
      por_estado: Record<string, number>;
      rebajas_totales: number;
      valor_perdido: number;
    };
    error?: string;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api-beta/control-vencimientos/estados/estadisticas`, {
        withCredentials: true,
      });
      return response.data;
    } catch {
      return {
        success: false,
        error: 'Error al obtener estadísticas'
      };
    }
  }

  // Obtener estadísticas de estados (nuevo endpoint)
  async obtenerEstadisticasEstadosVencimientos(): Promise<{
    success: boolean;
    data?: Array<{
      estado: string;
      cantidad_productos_unicos: string;
      cantidad_total_estados: string;
      total_cantidad_afectada: string;
      precio_rebaja_promedio: string | null;
    }>;
    error?: string;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api-beta/control-vencimientos/estados/estadisticas`, {
        withCredentials: true,
      });
      return response.data;
    } catch {
      return {
        success: false,
        error: 'Error al obtener estadísticas de estados'
      };
    }
  }

  // Obtener stock disponible de un vencimiento
  async obtenerStockDisponible(vencimientoId: number): Promise<{
    success: boolean;
    data?: {
      stock_disponible: number;
      cantidad_afectada_total: number;
    };
    error?: string;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api-beta/control-vencimientos/${vencimientoId}/stock-disponible`, {
        withCredentials: true,
      });
      return response.data;
    } catch {
      return {
        success: false,
        error: 'Error al obtener stock disponible'
      };
    }
  }
}

export const vencimientosEstadosService = new VencimientosEstadosService(); 