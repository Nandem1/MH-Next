// src/services/facturaService.ts
import axios from "axios";
import { Factura, FacturaResponse, FacturaDisponibleResponse, ActualizarMetodoPagoRequest } from "@/types/factura";
import { adaptFactura, adaptFacturaDisponible } from "@/utils/adaptFactura";

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
  local?: string,
  usuario?: string,
  proveedor?: string,
  folio?: string
): Promise<{ facturas: Factura[]; total: number }> => {
  try {
    const localMapping: Record<string, number> = {
      "LA CANTERA 3055": 1,
      "LIBERTADOR 1476": 2,
      "BALMACEDA 599": 3,
    };

    const id_local = local ? localMapping[local] : undefined;

    // Si hay folio, usamos endpoint específico (mismo formato que lista)
    if (folio) {
      const byFolio = await axios.get(`${API_URL}/api-beta/facturas/${folio}`);
      const data: unknown = byFolio.data;
      // Soportar ambas formas: wrapper { facturas, total_registros } o item/array directo
      type FolioWrapper = { facturas?: FacturaResponse[]; total_registros?: number } | FacturaResponse | FacturaResponse[] | null | undefined;
      const safeData = data as FolioWrapper;
      const rawFacturas: FacturaResponse[] = Array.isArray((safeData as { facturas?: FacturaResponse[] })?.facturas)
        ? ((safeData as { facturas: FacturaResponse[] }).facturas)
        : Array.isArray(safeData)
          ? (safeData as FacturaResponse[])
          : safeData && (safeData as FacturaResponse)
            ? [safeData as FacturaResponse]
            : [];
      const total_registros: number = typeof (safeData as { total_registros?: number })?.total_registros === 'number'
        ? (safeData as { total_registros: number }).total_registros
        : rawFacturas.length;

      const adaptadas: Factura[] = rawFacturas
        .filter(Boolean)
        .map((f: FacturaResponse) => adaptFactura(f));

      // Aplicar filtros opcionales en cliente (si existen)
      const filtradas = adaptadas.filter((f) => {
        const matchLocal = local ? f.local.includes(local) : true;
        const matchUsuario = usuario ? f.nombre_usuario?.toString() === usuario : true;
        const matchProveedor = proveedor ? f.id_proveedor?.toString() === proveedor : true;
        return matchLocal && matchUsuario && matchProveedor;
      });
      return { facturas: filtradas, total: total_registros };
    }

    const response = await axios.get<FacturaAPIResponse>(`${API_URL}/api-beta/facturas`, {
      params: {
        limit,
        offset: (page - 1) * limit,
        ...(id_local ? { id_local } : {}),
        ...(usuario ? { id_usuario: usuario } : {}),
        ...(proveedor ? { id_proveedor: proveedor } : {}),
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

// Nueva función para actualizar el monto de una factura
export const actualizarMontoFactura = async (id: string, monto: number): Promise<void> => {
  try {
    await axios.put(`${API_URL}/api-beta/facturas/${id}/monto`, {
      monto: monto,
    });
  } catch (error) {
    console.error("Error actualizando monto de factura:", error);
    throw new Error("No se pudo actualizar el monto de la factura");
  }
};

// Nueva función para actualizar el método de pago de una factura
export const actualizarMetodoPagoFactura = async (data: ActualizarMetodoPagoRequest): Promise<void> => {
  try {
    await axios.put(`${API_URL}/api-beta/facturas/${data.id}/metodo-pago`, {
      metodo_pago: data.metodo_pago,
      monto_pagado: data.monto_pagado,
      cheque: data.cheque,
    });
  } catch (error) {
    console.error("Error actualizando método de pago de factura:", error);
    throw new Error("No se pudo actualizar el método de pago de la factura");
  }
};

// ===== NUEVOS MÉTODOS PARA NÓMINAS HÍBRIDAS =====

// Obtener facturas disponibles (no asignadas a nóminas)
export const getFacturasDisponibles = async (filtros: {
  page?: number;
  limit?: number;
  proveedor?: string;
  folio?: string;
} = {}): Promise<{
  data: Factura[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}> => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.limit) params.append('limit', filtros.limit.toString());
    if (filtros.proveedor) params.append('proveedor', filtros.proveedor);
    if (filtros.folio) params.append('folio', filtros.folio);

    const queryString = params.toString();
    const url = `${API_URL}/api-beta/facturas/disponibles${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get(url);

    // Verificar si la respuesta tiene la estructura esperada
    if (!response.data || !response.data.data) {
      console.error('Unexpected response structure:', response.data);
      throw new Error('Estructura de respuesta inesperada del servidor');
    }

    // Aplicar adaptFacturaDisponible a cada factura para el endpoint específico
    const facturasAdaptadas = response.data.data.map((f: FacturaDisponibleResponse) => adaptFacturaDisponible(f));

    return {
      data: facturasAdaptadas,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error("Error obteniendo facturas disponibles:", error);
    throw new Error("No se pudieron cargar las facturas disponibles");
  }
};

// Obtener facturas asignadas a una nómina específica
export const getFacturasAsignadas = async (nominaId: string): Promise<Factura[]> => {
  try {
    const response = await axios.get(`${API_URL}/api-beta/nominas/${nominaId}/facturas`);
    return response.data.data.map((f: FacturaResponse) => adaptFactura(f));
  } catch (error) {
    console.error("Error obteniendo facturas asignadas:", error);
    throw new Error("No se pudieron cargar las facturas asignadas");
  }
};
