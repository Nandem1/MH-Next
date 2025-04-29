// src/services/facturaService.ts
import axios from "axios";
import { Factura, FacturaResponse } from "@/types/factura";
import { adaptFactura } from "@/utils/adaptFactura";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FacturaAPIResponse {
  facturas: FacturaResponse[];
  total_registros: number;
  pagina_actual: number;
  total_paginas: number;
}

export const getFacturas = async (
  page: number = 1,
  limit: number = 10,
  local?: string // ✅ Nuevo parámetro
): Promise<{ facturas: Factura[]; total: number }> => {
  try {
    const localMap: Record<string, number> = {
      "LA CANTERA": 1,
      LIBERTADOR: 2,
      BALMACEDA: 3,
    };

    const id_local = local ? localMap[local] : undefined;

    const response = await axios.get<FacturaAPIResponse>(`${API_URL}/api/facturas`, {
      params: {
        limit,
        offset: (page - 1) * limit,
        ...(id_local ? { id_local } : {}), // ✅ solo si aplica
      },
    });

    const { facturas: rawFacturas, total_registros } = response.data;
    const facturas: Factura[] = rawFacturas.map((f) => adaptFactura(f));

    return { facturas, total: total_registros };
  } catch (error) {
    console.error("Error obteniendo facturas:", error);
    throw new Error("No se pudieron cargar las facturas");
  }
};
