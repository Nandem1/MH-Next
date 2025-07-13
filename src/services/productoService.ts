interface FechaVencimiento {
  fecha_vencimiento: string;
  cantidad: number;
  lote: string;
}

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  unidad: string;
  precio: string;
  codigo_barra_interno: string;
  codigo_barra_externo: string;
  descripcion: string;
  es_servicio: boolean;
  es_exento: boolean;
  impuesto_especifico: string;
  id_categoria: number | null;
  disponible_para_venta: boolean;
  activo: boolean;
  utilidad: string;
  tipo_utilidad: string | null;
  origen: string;
  codigo_final: string;
  codigo_pack: string | null;
  nombre_pack: string | null;
  precio_base: string | null;
  cantidad_articulo: number | null;
  codigo_articulo: string | null;
  cod_barra_articulo: string | null;
  nombre_articulo: string | null;
  lista_precio_detalle: string | null;
  lista_precio_mayorista: string | null;
  lista_updated_at: string | null;
  fechas_vencimiento: FechaVencimiento[];
}

interface ProductoResponse {
  success: boolean;
  data: Producto;
  total: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const buscarProductoPorCodigo = async (codigoBarras: string): Promise<ProductoResponse> => {
  try {
    const url = `${API_BASE_URL}/api-beta/productos/${codigoBarras}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    }
    
    const data: ProductoResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error buscando producto:', error);
    throw error;
  }
};

export type { Producto, FechaVencimiento, ProductoResponse }; 