// src/types/factura.d.ts

export interface FacturaResponse {
  folio: string;
  proveedor: string;
  image_url: string;
  image_url_cloudinary: string;
  fecha_registro: string;
  nombre_local: string;
  nombre_usuario: string;
  rut_proveedor?: string;
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
}