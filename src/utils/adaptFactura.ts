// src/utils/adaptFactura.ts
import { Factura, FacturaResponse } from "@/types/factura";

const locales: { [key: number]: string } = {
  1: "LA CANTERA 3055",
  2: "LIBERTADOR 1476",
  3: "BALMACEDA 599",
};

const transformDriveUrl = (url: string) => {
  const regex = /\/file\/d\/(.*?)\/view/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?id=${match[1]}`;
  }
  return url;
};

export function adaptFactura(factura: FacturaResponse, index: number = 0): Factura {
  return {
    id: `${index}`, // inventamos ID si no tiene
    folio: factura.folio,
    proveedor: factura.proveedor,
    local: locales[factura.id_local] || "Local desconocido",
    estado: "BODEGA", // default
    fechaIngreso: factura.fecha_registro,
    image_url: transformDriveUrl(factura.image_url || ""),
    image_url_cloudinary: factura.image_url_cloudinary,
    nombre_usuario: factura.nombre_usuario,
    rut_proveedor: factura.rut_proveedor || "undefined",
  };
}
