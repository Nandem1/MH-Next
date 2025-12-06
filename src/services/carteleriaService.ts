import { Carteleria } from "@/types/carteleria";
import { ENV } from '@/config/env';

const API_BASE_URL = ENV.API_URL;

export const carteleriaService = {
  async getAuditoriaCarteleria(): Promise<Carteleria[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/auditoria-carteleria`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener auditoría de cartelería: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en carteleriaService.getAuditoriaCarteleria:", error);
      throw error;
    }
  },
}; 