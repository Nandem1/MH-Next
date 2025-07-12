// src/types/factura.d.ts

export interface FacturaResponse {
  id: number; // ID real de la base de datos (ahora siempre incluido)
  folio: string;
  proveedor: string;
  image_url: string;
  image_url_cloudinary: string;
  fecha_registro: string;
  nombre_local: string;
  nombre_usuario: string;
  rut_proveedor?: string;
  monto?: number; // Campo real del monto desde el backend
}

export interface Factura {
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
}