// src/services/facturaService.ts
import axios from "axios";
import { Factura, FacturaResponse } from "@/types/factura";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Ajusta tu URL

const transformDriveUrl = (url: string) => {
  const regex = /\/file\/d\/(.*?)\/view/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?id=${match[1]}`;
  }
  return url;
};


export const getFacturas = async (): Promise<Factura[]> => {
  try {
    console.log("Haciendo GET a:", `${API_URL}/api/facturas`);
    const response = await axios.get<FacturaResponse[]>(`${API_URL}/api/facturas`);
    
    console.log("Respuesta de la API:", response.data);
    debugger;

    const locales: { [key: number]: string } = {
      1: "LA CANTERA 3055",
      2: "LIBERTADOR 1476",
      3: "BALMACEDA 599",
    };

    const facturas: Factura[] = response.data.map((factura, index) => ({
      id: `${index}`, // inventamos un id temporal
      folio: factura.folio,
      proveedor: factura.proveedor,
      local: locales[factura.id_local] || "Local desconocido", // default
      estado: "BODEGA",    // default
      fechaIngreso: factura.fecha_registro,
      image_url: transformDriveUrl(factura.image_url),
      image_url_cloudinary: factura.image_url_cloudinary,
      nombre_usuario: factura.nombre_usuario,
      rut_proveedor: factura.rut_proveedor || "undefined"
    }));

    return facturas;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error de Axios al obtener facturas:", error.response?.status, error.response?.data);
    } else {
      console.error("Error desconocido al obtener facturas:", error);
    }
    debugger;
    throw new Error("No se pudieron cargar las facturas");
  }
};
