import { createAuthenticatedApi, handleApiError, checkAuthentication } from "@/utils/apiConfig";
import { AxiosError } from "axios";

export interface CuentaContable {
  id: string;
  nombre: string;
  codigo?: string;
  categoria: 'ACTIVOS' | 'GASTOS_OPERACIONALES' | 'GASTOS_GENERALES' | 'OTROS';
  esMasUtilizada?: boolean;
}

// Interfaces para las respuestas de la API
export interface CuentasContablesResponse {
  success: boolean;
  data: CuentaContable[];
  meta?: {
    total: number;
    pagina: number;
    limite: number;
  };
}

export interface CuentasMasUtilizadasResponse {
  success: boolean;
  data: CuentaContable[];
  meta?: {
    total: number;
  };
}

// Instancia de API configurada para cuentas contables
const cuentasContablesApi = createAuthenticatedApi();

class CuentasContablesService {
  
  /**
   * Obtener todas las cuentas contables desde la API
   */
  async obtenerCuentasContables(): Promise<CuentaContable[]> {
    try {
      checkAuthentication();
      const response = await cuentasContablesApi.get<CuentasContablesResponse>('/cuentas-contables');
      
      if (!response.data.success) {
        throw new Error('Error en la respuesta del servidor');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo cuentas contables:', error);
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Obtener cuentas más utilizadas desde la API
   */
  async obtenerCuentasMasUtilizadas(): Promise<CuentaContable[]> {
    try {
      checkAuthentication();
      const response = await cuentasContablesApi.get<CuentasMasUtilizadasResponse>('/cuentas-contables/mas-utilizadas');
      
      if (!response.data.success) {
        throw new Error('Error en la respuesta del servidor');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo cuentas más utilizadas:', error);
      return handleApiError(error as AxiosError);
    }
  }
  
  
  /**
   * Buscar cuentas por texto
   */
  async buscarCuentas(texto: string): Promise<CuentaContable[]> {
    try {
      checkAuthentication();
      const response = await cuentasContablesApi.get<CuentasContablesResponse>(`/cuentas-contables/buscar?q=${encodeURIComponent(texto)}`);
      
      if (!response.data.success) {
        throw new Error('Error en la respuesta del servidor');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error buscando cuentas:', error);
      return handleApiError(error as AxiosError);
    }
  }
  
  /**
   * Obtener cuenta por ID
   */
  async obtenerCuentaPorId(id: string): Promise<CuentaContable | null> {
    try {
      checkAuthentication();
      const response = await cuentasContablesApi.get<{ success: boolean; data: CuentaContable }>(`/cuentas-contables/${id}`);
      
      if (!response.data.success) {
        return null;
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo cuenta por ID:', error);
      return null;
    }
  }
}

export const cuentasContablesService = new CuentasContablesService();
