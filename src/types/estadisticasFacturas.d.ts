// src/types/estadisticasFacturas.d.ts

export interface EstadisticasFacturasHistorico {
  total_facturas: number;
  total_cheques: number;
  facturas_en_nominas: number;
  facturas_con_monto: number;
  total_notas_credito: number;
  primera_factura_fecha: string;
  facturas_por_local: FacturasPorLocal[];
}

export interface FacturasPorLocal {
  id: number;
  nombre_local: string;
  cantidad_facturas: number;
}

export interface EstadisticasFacturasDiario {
  fecha: string;
  facturas_hoy: number;
  notas_credito_hoy: number;
}

export interface EstadisticasFacturasResponse {
  success: boolean;
  data: {
    historico: EstadisticasFacturasHistorico;
    diario: EstadisticasFacturasDiario;
  };
  timestamp: string;
}

// Tipos para el hook
export interface UseEstadisticasFacturasReturn {
  estadisticas: EstadisticasFacturasResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  invalidarEstadisticas: () => void;
}
