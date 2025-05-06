// src/services/facturaService.ts
import axios from "axios";
import { Factura, FacturaResponse } from "@/types/factura";
import { adaptFactura } from "@/utils/adaptFactura";

// Configuración base de axios
const axiosInstance = axios.create({
  timeout: 10000, // 10 segundos de timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

interface FacturaAPIResponse {
  facturas: FacturaResponse[];
  total_registros: number;
  pagina_actual: number;
  total_paginas: number;
}

export const getFacturas = async (
  page: number = 1,
  limit: number = 10,
  local?: string
): Promise<{ facturas: Factura[]; total: number }> => {
  try {
    const localMap: Record<string, number> = {
      "LA CANTERA": 1,
      LIBERTADOR: 2,
      BALMACEDA: 3,
    };

    const id_local = local ? localMap[local] : undefined;

    const response = await axiosInstance.get<FacturaAPIResponse>('/api-beta/facturas', {
      params: {
        limit,
        offset: (page - 1) * limit,
        ...(id_local ? { id_local } : {}),
      }
    });

    if (!response.data) {
      throw new Error("No se recibieron datos del servidor");
    }

    const { facturas: rawFacturas, total_registros } = response.data;
    
    if (!Array.isArray(rawFacturas)) {
      throw new Error("Formato de respuesta inválido");
    }

    const facturas: Factura[] = rawFacturas.map((f) => adaptFactura(f));

    return { facturas, total: total_registros };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error("La conexión tardó demasiado. Por favor, intente nuevamente.");
      }
      if (!error.response) {
        throw new Error("No se pudo conectar con el servidor. Verifique su conexión a internet.");
      }
      const message = error.response?.data?.message || error.message;
      throw new Error(`Error obteniendo facturas: ${message}`);
    }
    throw new Error("No se pudieron cargar las facturas");
  }
};

export const updateFacturaEstado = async (
  facturaId: string,
  nuevoEstado: "BODEGA" | "SALA",
  idUsuario: number
): Promise<void> => {
  try {
    const estadoNumerico = nuevoEstado === "BODEGA" ? 1 : 2;
    await axiosInstance.patch(`/api-beta/facturas/${facturaId}/estado`, {
      estado: estadoNumerico,
      id_usuario: idUsuario
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error("La conexión tardó demasiado. Por favor, intente nuevamente.");
      }
      if (!error.response) {
        throw new Error("No se pudo conectar con el servidor. Verifique su conexión a internet.");
      }
      const message = error.response?.data?.message || error.message;
      throw new Error(`Error actualizando estado: ${message}`);
    }
    throw new Error("No se pudo actualizar el estado de la factura");
  }
};
