// src/services/facturaService.ts
import axios from "axios";
import { Factura, FacturaResponse } from "@/types/factura";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Ajusta tu URL

import { adaptFactura } from "@/utils/adaptFactura";

export const getFacturas = async (): Promise<Factura[]> => {
  try {
    const response = await axios.get<FacturaResponse[]>(`${API_URL}/api/facturas`);
    const facturas: Factura[] = response.data.map((factura, index) => adaptFactura(factura, index));
    return facturas;
  } catch (error) {
    console.error("Error obteniendo facturas:", error);
    throw new Error("No se pudieron cargar las facturas");
  }
};