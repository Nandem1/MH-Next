export interface Vencimiento {
  id?: number;
  codigo_barras: string;
  fecha_vencimiento: string;
  cantidad?: number;
  lote?: string;
  created_at?: string;
  updated_at?: string;
}

// Nueva interfaz para la respuesta actualizada de control de vencimientos
export interface ControlVencimiento {
  id: number;
  codigo_barras: string;
  fecha_vencimiento: string;
  cantidad: number;
  lote: string | null;
  created_at: string;
  updated_at: string;
  origen: string;
  codigo_final: string;
  codigo_producto: string;
  nombre_producto: string;
  unidad_producto: string;
  precio_producto: string;
  descripcion_producto: string;
  categoria_id: number;
  categoria_nombre: string;
  codigo_pack: string | null;
  nombre_pack: string | null;
  precio_base: number | null;
  cantidad_articulo: number | null;
  codigo_articulo: string | null;
  cod_barra_articulo: string | null;
  nombre_articulo: string | null;
  lista_precio_detalle: number;
  lista_precio_mayorista: number;
  lista_updated_at: string;
  estado_actual_id?: string;
}

export interface ControlVencimientosResponse {
  success: boolean;
  data: ControlVencimiento[];
  total: number;
}

export interface VencimientoFormData {
  codigo_barras: string;
  fecha_vencimiento: string;
  cantidad: string;
  lote: string;
}

export interface VencimientoResponse {
  success: boolean;
  data?: Vencimiento | Vencimiento[];
  message?: string;
  error?: string;
}

// Nuevos tipos para estados de vencimientos (simplificados)
export type VencimientoEstado = 
  | 'pendiente'
  | 'rebajado'
  | 'vendido';

export interface VencimientoEstadoData {
  id: number;
  vencimiento_id: number;
  estado: VencimientoEstado;
  precio_rebaja?: number;
  cantidad_afectada: number;
  motivo?: string; // Cambiado de observaciones a motivo para coincidir con la BD
  usuario_id?: number;
  usuario_nombre?: string;
  created_at: string;
}

export interface ActualizarEstadoVencimientoRequest {
  vencimiento_id: number;
  estado: VencimientoEstado;
  precio_rebaja?: number;
  cantidad_afectada: number;
  motivo?: string; // Cambiado de observaciones a motivo para coincidir con la BD
}

export interface VencimientoConEstados extends Vencimiento {
  estados?: VencimientoEstadoData[];
  estado_actual?: VencimientoEstado;
  precio_actual?: number;
}

export interface VencimientoEstadosResponse {
  success: boolean;
  data?: VencimientoEstadoData | VencimientoEstadoData[];
  message?: string;
  error?: string;
} 