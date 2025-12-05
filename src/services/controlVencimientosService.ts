import axios from "axios";
import { ControlVencimientosResponse } from "@/types/vencimientos";
import { ENV } from '@/config/env';

// Usar la variable de entorno como los otros servicios
const API_BASE_URL = ENV.API_URL;

class ControlVencimientosService {
  async getControlVencimientos(): Promise<ControlVencimientosResponse> {
    try {
      const url = `${API_BASE_URL}/api-beta/control-vencimientos`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching control vencimientos:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
        console.error("Request URL:", error.config?.url);
      }
      throw new Error("Error al obtener los datos de control de vencimientos");
    }
  }
}

export const controlVencimientosService = new ControlVencimientosService(); 