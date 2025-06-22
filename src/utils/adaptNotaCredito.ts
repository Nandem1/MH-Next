import { NotaCredito, NotaCreditoResponse } from "@/types/notaCredito";

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

export function adaptNotaCredito(notaCredito: NotaCreditoResponse): NotaCredito {
  // Mapear el estado de la factura asociada
  const estadoFactura = mapEstado(notaCredito.factura_estado);

  return {
    id: `${notaCredito.folio_nc}-${notaCredito.fecha_registro}`,
    folio: notaCredito.folio_nc,
    proveedor: notaCredito.proveedor,
    local: notaCredito.nombre_local || "Local desconocido",
    estado: "BODEGA", // Estado por defecto para la nota de crédito
    fechaIngreso: notaCredito.fecha_registro,
    image_url: transformDriveUrl(notaCredito.image_url || ""),
    image_url_cloudinary: notaCredito.image_url_cloudinary,
    nombre_usuario: notaCredito.nombre_usuario,
    rut_proveedor: notaCredito.rut_proveedor || "undefined",
    facturaAsociada: notaCredito.folio_factura_referenciada
      ? {
          folio: notaCredito.folio_factura_referenciada,
          proveedor: notaCredito.proveedor, // Usamos el mismo proveedor de la NC
          estado: estadoFactura,
          fechaIngreso: notaCredito.factura_fecha_registro,
          image_url_cloudinary: notaCredito.factura_image_url_cloudinary,
        }
      : undefined,
  };
} 