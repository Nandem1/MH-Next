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

// Función para generar montos ficticios basados en el folio (ya no se usa)
// const generarMontoFicticio = (folio: string): number => {
//   // Usar el folio como semilla para generar un monto consistente
//   const hash = folio.split('').reduce((a, b) => {
//     a = ((a << 5) - a) + b.charCodeAt(0);
//     return a & a;
//   }, 0);
//   
//   // Generar un monto entre 50,000 y 2,000,000 pesos
//   const monto = Math.abs(hash) % 1950000 + 50000;
//   
//   // Redondear a múltiplos de 1000
//   return Math.round(monto / 1000) * 1000;
// };

export function adaptFactura(factura: FacturaResponse): Factura {
  return {
    id: factura.id.toString(), // Usar ID real de la base de datos
    folio: factura.folio,
    proveedor: factura.proveedor,
    local: factura.nombre_local || "Local desconocido",
    estado: "BODEGA",
    fechaIngreso: factura.fecha_registro,
    image_url: transformDriveUrl(factura.image_url || ""),
    image_url_cloudinary: factura.image_url_cloudinary,
    nombre_usuario: factura.nombre_usuario,
    rut_proveedor: factura.rut_proveedor || "undefined",
    monto: factura.monto || 0, // Usar monto real del API, 0 si no existe
  };
}
