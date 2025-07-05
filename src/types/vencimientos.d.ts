export interface Vencimiento {
  id?: number;
  codigo_barras: string;
  fecha_vencimiento: string;
  cantidad?: number;
  lote?: string;
  created_at?: string;
  updated_at?: string;
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