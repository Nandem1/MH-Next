import axios from 'axios';
import { Vencimiento, VencimientoResponse, ControlVencimientosResponse } from '../types/vencimientos';

// Usar la variable de entorno como los otros servicios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper para manejar errores de axios
const handleAxiosError = (error: unknown): VencimientoResponse => {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data as VencimientoResponse;
  }
  return {
    success: false,
    error: 'Error de conexión'
  };
};

// Crear un nuevo control de vencimiento
export const crearControlVencimiento = async (vencimiento: Omit<Vencimiento, 'id' | 'created_at' | 'updated_at'>): Promise<VencimientoResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api-beta/control-vencimientos`, vencimiento);
    return response.data;
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

// Obtener todos los controles de vencimiento
export const obtenerControlVencimientos = async (): Promise<ControlVencimientosResponse> => {
  try {
    const url = `${API_BASE_URL}/api-beta/control-vencimientos`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error: unknown) {
    console.error("Error en vencimientosService:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      console.error("Request URL:", error.config?.url);
    }
    return {
      success: false,
      data: [],
      total: 0
    };
  }
};

// Obtener un control de vencimiento por ID
export const obtenerControlVencimientoPorId = async (id: number): Promise<VencimientoResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api-beta/control-vencimientos/${id}`);
    return response.data;
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

// Actualizar un control de vencimiento
export const actualizarControlVencimiento = async (id: number, vencimiento: Partial<Vencimiento>): Promise<VencimientoResponse> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api-beta/control-vencimientos/${id}`, vencimiento);
    return response.data;
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

// Eliminar un control de vencimiento
export const eliminarControlVencimiento = async (id: number): Promise<VencimientoResponse> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api-beta/control-vencimientos/${id}`);
    return response.data;
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
}; 