export interface Carteleria {
  carteleria_id: number;
  codigo_barras: string;
  tipo_carteleria: string;
  carteleria_precio_detalle: number;
  carteleria_precio_mayorista: number | null;
  codigo: string | null | "";
  nombre: string | null | "";
  lista_precio_detalle: number | null;
  lista_precio_mayorista: number | null;
  lista_updated_at: string | null;
  // Campos del pack/display
  codigo_pack: string | null;
  cod_barra_pack: string | null;
  nombre_pack: string | null;
  precio_base: number | null;
  cantidad_articulo: number | null;
  codigo_articulo: string | null;
  cod_barra_articulo: string | null;
  nombre_articulo: string | null;
}

export interface CarteleriaAuditResult {
  carteleria: Carteleria;
  precioDetalleCoincide: boolean;
  precioMayoristaCoincide: boolean;
  diferenciaDetalle: number;
  diferenciaMayorista: number;
} 