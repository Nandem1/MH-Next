// src/utils/adaptFactura.ts
import { Factura, FacturaResponse } from "@/types/factura";

const transformDriveUrl = (url: string) => {
  const regex = /\/file\/d\/(.*?)\/view/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?id=${match[1]}`;
  }
  return url;
};

export function adaptFactura(factura: FacturaResponse): Factura {
  // Convertir el estado numérico a string
  const estadoNumerico = factura.estado ?? 1;
  const estado = estadoNumerico === 1 ? "BODEGA" : estadoNumerico === 2 ? "SALA" : "BODEGA";

  return {
    id: factura.folio,
    folio: factura.folio,
    proveedor: factura.proveedor,
    local: factura.nombre_local || "Local desconocido",
    estado,
    fechaIngreso: factura.fecha_registro,
    image_url: transformDriveUrl(factura.image_url || ""),
    image_url_cloudinary: factura.image_url_cloudinary,
    nombre_usuario: factura.nombre_usuario,
    rut_proveedor: factura.rut_proveedor || "undefined",
  };
}
