import { NotaCredito, NotaCreditoResponse } from "@/types/notaCredito";
import { montoAEntero } from "@/utils/formatearMonto";

const transformDriveUrl = (url: string) => {
  const regex = /\/file\/d\/(.*?)\/view/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?id=${match[1]}`;
  }
  return url;
};

// Función para mapear el estado numérico a string
const mapEstado = (estado: number): string => {
  switch (estado) {
    case 1:
      return "BODEGA";
    case 2:
      return "SALA";
    default:
      return "BODEGA";
  }
};

// Función para generar montos ficticios basados en el folio (ya no se usa)
// const generarMontoFicticio = (folio: string): number => {
//   // Usar el folio como semilla para generar un monto consistente
//   const hash = folio.split('').reduce((a, b) => {
//     a = ((a << 5) - a) + b.charCodeAt(0);
//     return a & a;
//   }, 0);
//   
//   // Generar un monto entre 10,000 y 500,000 pesos (notas de crédito suelen ser menores)
//   const monto = Math.abs(hash) % 490000 + 10000;
//   
//   // Redondear a múltiplos de 1000
//   return Math.round(monto / 1000) * 1000;
// };

export function adaptNotaCredito(notaCredito: NotaCreditoResponse): NotaCredito {
  // Mapear el estado de la factura asociada
  const estadoFactura = mapEstado(notaCredito.factura_estado);

  return {
    id: notaCredito.id.toString(), // Usar ID real de la base de datos
    folio: notaCredito.folio_nc,
    proveedor: notaCredito.proveedor,
    local: notaCredito.nombre_local || "Local desconocido",
    estado: "BODEGA", // Estado por defecto para la nota de crédito
    fechaIngreso: notaCredito.fecha_registro,
    image_url: transformDriveUrl(notaCredito.image_url || ""),
    image_url_cloudinary: notaCredito.image_url_cloudinary,
    nombre_usuario: notaCredito.nombre_usuario,
    rut_proveedor: notaCredito.rut_proveedor || "undefined",
    monto: montoAEntero(notaCredito.monto || 0), // Usar monto real del API, 0 si no existe
    facturaAsociada: notaCredito.folio_factura_referenciada
      ? {
          folio: notaCredito.folio_factura_referenciada,
          proveedor: notaCredito.proveedor, // Usamos el mismo proveedor de la NC
          estado: estadoFactura,
          fechaIngreso: notaCredito.factura_fecha_registro,
          image_url_cloudinary: notaCredito.factura_image_url_cloudinary,
          monto: montoAEntero(notaCredito.factura_monto || 0), // Usar monto real de la factura asociada
        }
      : undefined,
  };
} 