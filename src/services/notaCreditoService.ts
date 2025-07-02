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