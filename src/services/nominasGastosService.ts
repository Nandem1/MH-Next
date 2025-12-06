// src/services/nominasGastosService.ts

import axios from 'axios';
import { 
  NominasGastosResponse, 
  NominaGastoDetalleResponse, 
  FiltrosNominasGastos,
  ErrorResponse 
} from '@/types/nominasGastos';
import { ENV } from '@/config/env';

const API_URL = ENV.API_URL;

class NominasGastosService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Obtener nóminas de gastos con filtros y estadísticas
   */
  async getNominasGastos(filtros: FiltrosNominasGastos = {}): Promise<NominasGastosResponse> {
    try {
      const params = new URLSearchParams();
      
      // Agregar parámetros de filtro
      if (filtros.usuario_id) params.append('usuario_id', filtros.usuario_id.toString());
      if (filtros.local_id) params.append('local_id', filtros.local_id.toString());
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
      if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
      if (filtros.monto_min) params.append('monto_min', filtros.monto_min.toString());
      if (filtros.monto_max) params.append('monto_max', filtros.monto_max.toString());
      if (filtros.pagina) params.append('pagina', filtros.pagina.toString());
      if (filtros.limite) params.append('limite', filtros.limite.toString());
      if (filtros.include_stats) params.append('include_stats', 'true');
      if (filtros.stats_tipo) params.append('stats_tipo', filtros.stats_tipo);

      const url = `${API_URL}/api-beta/nominas-gastos?${params.toString()}`;
      const headers = this.getAuthHeaders();

      const response = await axios.get<NominasGastosResponse>(url, { headers });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          throw new Error('Error 403: No tienes permisos para acceder a este recurso. Verifica tu autenticación.');
        }
        
        const errorData = error.response?.data as ErrorResponse;
        throw new Error(errorData?.error?.message || `Error ${error.response?.status}: ${error.response?.statusText}`);
      }
      throw new Error('Error de conexión al obtener nóminas de gastos');
    }
  }

  /**
   * Obtener detalle de una nómina específica
   * Nota: El ID puede ser string (rendiciones activas) o number (nóminas generadas)
   */
  async getNominaGastoDetalle(id: string | number): Promise<NominaGastoDetalleResponse> {
    try {
      const response = await axios.get<NominaGastoDetalleResponse>(
        `${API_URL}/api-beta/nominas-gastos/${id}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as ErrorResponse;
        if (error.response?.status === 404) {
          throw new Error('Nómina no encontrada');
        }
        throw new Error(errorData?.error?.message || 'Error al obtener detalle de nómina');
      }
      throw new Error('Error de conexión al obtener detalle de nómina');
    }
  }

  /**
   * Construir URL de filtros para debugging
   */
  buildFiltersUrl(filtros: FiltrosNominasGastos): string {
    const params = new URLSearchParams();
    
    if (filtros.usuario_id) params.append('usuario_id', filtros.usuario_id.toString());
    if (filtros.local_id) params.append('local_id', filtros.local_id.toString());
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
    if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
    if (filtros.monto_min) params.append('monto_min', filtros.monto_min.toString());
    if (filtros.monto_max) params.append('monto_max', filtros.monto_max.toString());
    if (filtros.pagina) params.append('pagina', filtros.pagina.toString());
    if (filtros.limite) params.append('limite', filtros.limite.toString());
    if (filtros.include_stats) params.append('include_stats', 'true');
    if (filtros.stats_tipo) params.append('stats_tipo', filtros.stats_tipo);

    return `${API_URL}/api-beta/nominas-gastos?${params.toString()}`;
  }
}

// Exportar instancia singleton
export const nominasGastosService = new NominasGastosService();
export default nominasGastosService;
