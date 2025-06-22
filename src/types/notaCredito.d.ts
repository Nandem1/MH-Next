export interface NotaCreditoResponse {
  folio_nc: string;
  folio_factura_referenciada: string;
  factura_image_url: string;
  factura_image_url_cloudinary: string;
  factura_estado: number;
  factura_fecha_registro: string;
  factura_id_proveedor: number;
  factura_id_local: number;
  factura_id_usuario: number;
  image_url: string;
  image_url_cloudinary: string;
  id_local: number;
  nombre_local: string;
  fecha_registro: string;
  proveedor: string;
  rut_proveedor: string;
  nombre_usuario: string;
}

export interface NotaCredito {
  id: string;
  folio: string;
  proveedor: string;
  local: string;
  estado: "BODEGA" | "SALA";
  fechaIngreso: string; // Formato ISO (YYYY-MM-DDTHH:mm:ss)
  image_url: string;
  image_url_cloudinary: string;
  nombre_usuario: string;
  rut_proveedor?: string;
  facturaAsociada?: {
    folio: string;
    proveedor: string;
    estado: string;
    fechaIngreso: string;
    image_url_cloudinary: string;
  };
} 