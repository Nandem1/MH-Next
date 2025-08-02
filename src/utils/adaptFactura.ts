// src/utils/adaptFactura.ts
import { Factura, FacturaResponse, FacturaDisponibleResponse } from "@/types/factura";
import { montoAEntero } from "@/utils/formatearMonto";

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
    monto: montoAEntero(typeof factura.monto === 'string' ? parseFloat(factura.monto) : factura.monto || 0), // Convertir string a entero
    // Nuevas propiedades de método de pago con valores del backend o por defecto
    metodo_pago: factura.metodo_pago || "POR_PAGAR",
    monto_pagado: factura.monto_pagado ? montoAEntero(typeof factura.monto_pagado === 'string' ? parseFloat(factura.monto_pagado) : factura.monto_pagado) : undefined,
    cheque_correlativo: factura.cheque_correlativo,
    id_proveedor: factura.id_proveedor, // ID del proveedor para endpoints
    // Nuevo campo para disponibilidad en nóminas
    asignado_a_nomina: factura.asignado_a_nomina || false,
  };
}

// Nueva función específica para adaptar facturas del endpoint de disponibles
export function adaptFacturaDisponible(factura: FacturaDisponibleResponse): Factura {
  return {
    id: factura.id.toString(),
    folio: factura.folio,
    proveedor: factura.nombre_proveedor, // Usar nombre_proveedor del endpoint específico
    local: "Local desconocido", // No viene en la respuesta
    estado: "BODEGA",
    fechaIngreso: factura.fecha_factura, // Usar fecha_factura del endpoint específico
    image_url: "", // No viene en la respuesta
    image_url_cloudinary: "", // No viene en la respuesta
    nombre_usuario: "Usuario desconocido", // No viene en la respuesta
    rut_proveedor: factura.rut_proveedor,
    monto: montoAEntero(factura.monto), // Ya viene como number
    // Valores por defecto para campos que no vienen en la respuesta
    metodo_pago: "POR_PAGAR",
    monto_pagado: undefined,
    cheque_correlativo: undefined,
    id_proveedor: undefined,
    asignado_a_nomina: false, // Por definición, las facturas disponibles no están asignadas
  };
}
