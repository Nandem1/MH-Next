// src/services/estadisticasFacturasService.ts

import axios from 'axios';
import { EstadisticasFacturasResponse } from '@/types/estadisticasFacturas';
import { ENV } from '@/config/env';
const API_URL = ENV.API_URL;

class EstadisticasFacturasService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Obtener estadísticas de facturas (histórico y diario)
   */
  async getEstadisticasFacturas(): Promise<EstadisticasFacturasResponse> {
    try {
      const response = await axios.get<EstadisticasFacturasResponse>(
        `${API_URL}/api-beta/estadisticas/facturas`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.data.success) {
        throw new Error('Error en la respuesta del servidor');
      }

      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de facturas:', error);
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        
        if (status === 401) {
          throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
        }
        if (status === 403) {
          throw new Error('No tienes permisos para acceder a estas estadísticas.');
        }
        if (status && status >= 500) {
          throw new Error('Error del servidor. Por favor, intenta más tarde.');
        }
        throw new Error(error.response?.data?.message || 'Error al obtener estadísticas de facturas');
      }
      
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }
}

// Exportar instancia singleton
export const estadisticasFacturasService = new EstadisticasFacturasService();
