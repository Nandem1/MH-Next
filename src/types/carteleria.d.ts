export interface Carteleria {
  carteleria_id: number;
  codigo_barras: string;
  tipo_carteleria: string;
  carteleria_precio_detalle: number;
  carteleria_precio_mayorista: number;
  codigo: string;
  nombre: string;
  lista_precio_detalle: number;
  lista_precio_mayorista: number;
  lista_updated_at: string;
}

export interface CarteleriaAuditResult {
  carteleria: Carteleria;
  precioDetalleCoincide: boolean;
  precioMayoristaCoincide: boolean;
  diferenciaDetalle: number;
  diferenciaMayorista: number;
} 