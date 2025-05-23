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
  return {
    id: `${factura.folio}-${factura.fecha_registro}`, // ahora es único y estable
    folio: factura.folio,
    proveedor: factura.proveedor,
    local: factura.nombre_local || "Local desconocido",
    estado: "BODEGA",
    fechaIngreso: factura.fecha_registro,
    image_url: transformDriveUrl(factura.image_url || ""),
    image_url_cloudinary: factura.image_url_cloudinary,
    nombre_usuario: factura.nombre_usuario,
    rut_proveedor: factura.rut_proveedor || "undefined",
  };
}
