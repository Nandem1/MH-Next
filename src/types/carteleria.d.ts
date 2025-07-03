export interface Carteleria {
  carteleria_id: number;
  codigo_barras: string;
  tipo_carteleria: string;
  carteleria_precio_detalle: number;
  carteleria_precio_mayorista: number;

  // Producto
  codigo?: string | null | undefined;
  nombre?: string | null | undefined;
  nombre_producto?: string | null | undefined;
  codigo_producto?: string | null | undefined;
  producto?: string | null | undefined;
  descripcion?: string | null | undefined;

  // Pack_listados
  codigo_pack?: string | null | undefined;
  cod_barra_pack?: string | null | undefined;
  nombre_pack?: string | null | undefined;
  precio_base?: number | null | undefined;
  cantidad_articulo?: number | null | undefined;
  codigo_articulo?: string | null | undefined;
  cod_barra_articulo?: string | null | undefined;
  nombre_articulo?: string | null | undefined;

  // Lista precios
  lista_precio_detalle?: number | null | undefined;
  lista_precio_mayorista?: number | null | undefined;
  lista_updated_at?: string | null | undefined;

  // Origen indicador
  origen?: "producto" | "pack" | "sin_origen" | null | undefined;
}

export interface CarteleriaAuditResult {
  carteleria: Carteleria;
  precioDetalleCoincide: boolean;
  precioMayoristaCoincide: boolean;
  diferenciaDetalle: number;
  diferenciaMayorista: number;
}

