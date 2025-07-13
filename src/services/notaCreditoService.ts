import axios from "axios";
import { NotaCredito, NotaCreditoResponse } from "@/types/notaCredito";
import { adaptNotaCredito } from "@/utils/adaptNotaCredito";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface NotaCreditoAPIResponse {
  notas_credito: NotaCreditoResponse[];
  total_registros: number;
  pagina_actual: number;
  total_paginas: number;
}

export const getNotasCredito = async (
  page: number = 1,
  limit: number = 10,
  local?: string,
  usuario?: string,
  proveedor?: string
): Promise<{ notasCredito: NotaCredito[]; total: number }> => {
  try {
    const localMap: Record<string, number> = {
      "LA CANTERA": 1,
      LIBERTADOR: 2,
      BALMACEDA: 3,
    };

    const id_local = local ? localMap[local] : undefined;

    const response = await axios.get<NotaCreditoAPIResponse>(`${API_URL}/api-beta/notas_credito`, {
      params: {
        limit,
        offset: (page - 1) * limit,
        ...(id_local ? { id_local } : {}),
        ...(usuario ? { id_usuario: usuario } : {}),
        ...(proveedor ? { id_proveedor: proveedor } : {}),
      },
    });

    const { notas_credito: rawNotasCredito, total_registros } = response.data;
    const notasCredito: NotaCredito[] = rawNotasCredito.map((nc) => adaptNotaCredito(nc));

    return { notasCredito, total: total_registros };
  } catch (error) {
    console.error("Error obteniendo notas de crédito:", error);
    throw new Error("No se pudieron cargar las notas de crédito");
  }
};

// Nueva función para obtener notas de crédito por proveedor
export const getNotasCreditoByProveedor = async (
  idProveedor: number,
  limit: number = 50
): Promise<{ notasCredito: NotaCredito[]; total: number }> => {
  try {
    const response = await axios.get<NotaCreditoAPIResponse>(`${API_URL}/api-beta/notas_credito`, {
      params: {
        limit,
        offset: 0,
        id_proveedor: idProveedor,
      },
    });

    const { notas_credito: rawNotasCredito, total_registros } = response.data;
    const notasCredito: NotaCredito[] = rawNotasCredito.map((nc) => adaptNotaCredito(nc));

    return { notasCredito, total: total_registros };
  } catch (error) {
    console.error("❌ Error obteniendo notas de crédito por proveedor:", error);
    throw new Error("No se pudieron cargar las notas de crédito del proveedor");
  }
};

// Nueva función para actualizar el monto de una nota de crédito
export const actualizarMontoNotaCredito = async (id: string, monto: number): Promise<void> => {
  try {
    await axios.put(`${API_URL}/api-beta/notas-credito/${id}/monto`, {
      monto: monto,
    });
  } catch (error) {
    console.error("Error actualizando monto de nota de crédito:", error);
    throw new Error("No se pudo actualizar el monto de la nota de crédito");
  }
}; 

// Nueva función para obtener notas de crédito de una factura específica
export const getNotasCreditoByFactura = async (idFactura: number): Promise<{ success: boolean; data: { notas_credito: Array<{ id: number; folio_nc: string; monto: number; id_factura_ref: number }> } }> => {
  try {
    console.log("🔍 Obteniendo notas de crédito de la factura:", idFactura);
    
    const response = await axios.get(`${API_URL}/api-beta/facturas/${idFactura}/notas-credito`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("✅ Notas de crédito de la factura obtenidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo notas de crédito de la factura:", error);
    throw new Error("No se pudieron cargar las notas de crédito de la factura");
  }
}; 