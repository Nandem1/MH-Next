// Tipos para el sistema de stock interno

export interface StockProducto {
  id?: number;
  codigo_producto: string;
  tipo_item: 'producto' | 'pack';
  cantidad: number;
  cantidad_minima?: number;
  nombre_producto?: string;
  codigo_barras?: string;
}

export interface StockMovimiento {
  id?: number;
  codigo_producto: string;
  tipo_item: 'producto' | 'pack';
  tipo_movimiento: 'entrada' | 'salida';
  cantidad: number;
  cantidad_anterior?: number;
  cantidad_nueva?: number;
  motivo: string;
  id_usuario: number;
  id_local: number;
  observaciones?: string;
  created_at?: string;
  nombre_usuario?: string;
  nombre_producto?: string;
}

export interface StockEntradaRequest {
  codigo_producto: string;
  tipo_item?: 'producto' | 'pack';
  cantidad: number;
  cantidad_minima?: number;
  motivo: string;
  id_local: number;
  id_usuario: number;
  observaciones?: string;
}

export interface StockSalidaRequest {
  codigo_producto: string;
  tipo_item?: 'producto' | 'pack';
  cantidad: number;
  motivo: string;
  id_local: number;
  id_usuario: number;
  observaciones?: string;
}

export interface StockEntradaMultipleRequest {
  productos: StockProducto[];
  motivo: string;
  id_local: number;
  id_usuario: number;
  observaciones?: string;
}

export interface StockSalidaMultipleRequest {
  productos: StockProducto[];
  motivo: string;
  id_local: number;
  id_usuario: number;
  observaciones?: string;
}

export interface StockResponse {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: string;
  details?: string;
  timestamp?: string;
}

export interface StockEntradaResponse {
  success: boolean;
  message: string;
  data: {
    codigo_producto: string;
    tipo_item: string;
    cantidad_anterior: number;
    cantidad_nueva: number;
    cantidad_ingresada: number;
    motivo: string;
    id_local: number;
    id_usuario: number;
    observaciones?: string;
    timestamp: string;
  };
}

export interface StockSalidaResponse {
  success: boolean;
  message: string;
  data: {
    codigo_producto: string;
    tipo_item: string;
    cantidad_anterior: number;
    cantidad_nueva: number;
    cantidad_retirada: number;
    motivo: string;
    id_local: number;
    id_usuario: number;
    observaciones?: string;
    timestamp: string;
  };
}

export interface StockMultipleResponse {
  success: boolean;
  message: string;
  total_productos: number;
  resultados: Array<{
    codigo_producto: string;
    tipo_item: string;
    cantidad: number;
    cantidad_nueva: number;
    success: boolean;
  }>;
  errores?: Array<{
    codigo_producto: string;
    error: string;
  }>;
  timestamp: string;
}

export interface StockLocalResponse {
  success: boolean;
  data: Array<{
    id: number;
    codigo_producto: string;
    tipo_item: string;
    cantidad_actual: number;
    cantidad_minima: number;
    id_local: number;
    updated_at: string;
    nombre_producto?: string;
    codigo_barras?: string;
  }>;
  total_productos: number;
  timestamp: string;
}

export interface StockBajoResponse {
  success: boolean;
  data: Array<{
    id: number;
    codigo_producto: string;
    tipo_item: string;
    cantidad_actual: number;
    cantidad_minima: number;
    id_local: number;
    nombre_producto?: string;
    codigo_barras?: string;
  }>;
  total_alertas: number;
  timestamp: string;
}

export interface StockMovimientosResponse {
  success: boolean;
  data: StockMovimiento[];
  total_movimientos: number;
  limit: number;
  offset: number;
  timestamp: string;
}

export interface StockProductosMovidosResponse {
  success: boolean;
  data: Array<{
    codigo_producto: string;
    tipo_item: string;
    total_movimientos: number;
    total_entradas: number;
    total_salidas: number;
    nombre_producto?: string;
  }>;
  tipo_consulta: string;
  total_productos: number;
  timestamp: string;
}

export interface StockReporteResponse {
  success: boolean;
  data: {
    resumen: {
      total_productos: number;
      total_packs: number;
      productos_stock_bajo: number;
      valor_total_estimado: number;
    };
    stock_actual: Array<{
      codigo_producto: string;
      tipo_item: string;
      cantidad_actual: number;
      cantidad_minima: number;
      nombre_producto?: string;
      estado: string;
    }>;
    alertas_stock_bajo: Array<{
      codigo_producto: string;
      tipo_item: string;
      cantidad_actual: number;
      cantidad_minima: number;
      nombre_producto?: string;
      estado: string;
    }>;
    movimientos_recientes: Array<{
      id: number;
      codigo_producto: string;
      tipo_movimiento: string;
      cantidad: number;
      motivo: string;
      created_at: string;
    }>;
  };
  timestamp: string;
}

export interface StockProductoResponse {
  success: boolean;
  data: {
    id: number;
    codigo_producto: string;
    tipo_item: string;
    cantidad_actual: number;
    cantidad_minima: number;
    id_local: number;
    updated_at: string;
    nombre_producto?: string;
    codigo_barras?: string;
    estado: string;
  };
  timestamp: string;
}

// Motivos predefinidos
export const MOTIVOS_ENTRADA = [
  'compra_proveedor',
  'ajuste_inventario_positivo',
  'traspaso_entrada'
] as const;

export const MOTIVOS_SALIDA = [
  'reposicion_sala',
  'merma_bodega',
  'traspaso_salida',
  'ajuste_inventario_negativo'
] as const;

export type MotivoEntrada = typeof MOTIVOS_ENTRADA[number];
export type MotivoSalida = typeof MOTIVOS_SALIDA[number]; 