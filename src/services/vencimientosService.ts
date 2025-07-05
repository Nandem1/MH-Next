import axios from 'axios';
import { Vencimiento, VencimientoResponse } from '../types/vencimientos';

// Configuración base de axios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api-beta';

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
export const obtenerControlVencimientos = async (): Promise<VencimientoResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api-beta/control-vencimientos`);
    return response.data;
  } catch (error: unknown) {
    return handleAxiosError(error);
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