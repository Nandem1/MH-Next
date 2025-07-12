export interface NotaCreditoResponse {
  id: number; // ID real de la base de datos (ahora siempre incluido)
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
  monto?: number; // Campo real del monto de la NC desde el backend
  factura_monto?: number; // Campo real del monto de la factura referenciada
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
  monto?: number; // Nuevo campo para el monto
  isUpdating?: boolean; // Estado de actualización
  pendingMonto?: number; // Monto pendiente de confirmación
  facturaAsociada?: {
    folio: string;
    proveedor: string;
    estado: string;
    fechaIngreso: string;
    image_url_cloudinary: string;
    monto?: number; // Nuevo campo para el monto de la factura asociada
  };
} 