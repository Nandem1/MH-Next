import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_GO_API_URL || 'http://localhost:8080/api/v1';

// Configuración base de axios
const productoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
productoApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
productoApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Producto API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface ProductoFactura {
  codigo_producto: string;
  nombre_producto: string;
  precio: number;
  codigo_barras: string;
  descripcion?: string;
  unidad: string;
  es_servicio: boolean;
  es_exento: boolean;
  disponible_para_venta: boolean;
  activo: boolean;
  id_categoria: number;
  nombre_categoria?: string;
}

export interface ProductoBusquedaResponse {
  success: boolean;
  message: string;
  data: {
    cache_hit: boolean;
    latency_ms: number;
    producto: ProductoFactura;
  };
}

export const productoService = {
  // 🚀 Búsqueda Rápida de Producto por Código de Barras (Para Facturas)
  async buscarProductoPorCodigo(codigo: string): Promise<ProductoFactura> {
    const response = await productoApi.get(`/pos/producto/${codigo}`);
    
    if (response.data.success && response.data.data.producto) {
      const producto = response.data.data.producto;
      
      // Helper para normalizar strings
      const normalizeString = (str: string) => str?.toUpperCase() || '';
      
      // Adaptar la respuesta del backend al formato para facturas (igual que stockService)
      if ('id' in producto) {
        // Es un artículo
        const articulo = producto;
        return {
          codigo_producto: normalizeString(articulo.codigo),
          nombre_producto: normalizeString(articulo.nombre),
          precio: articulo.precio,
          codigo_barras: normalizeString(articulo.codigo_barra_interno),
          descripcion: articulo.descripcion,
          unidad: articulo.unidad || 'unidad',
          es_servicio: articulo.es_servicio || false,
          es_exento: articulo.es_exento || false,
          disponible_para_venta: articulo.disponible_para_venta !== false,
          activo: articulo.activo !== false,
          id_categoria: articulo.id_categoria || 1,
        };
      } else {
        // Es un pack
        const pack = producto;
        return {
          codigo_producto: normalizeString(pack.codigo_articulo),
          nombre_producto: normalizeString(pack.nombre_articulo),
          precio: pack.precio || 0,
          codigo_barras: normalizeString(pack.cod_barra_articulo),
          descripcion: pack.descripcion,
          unidad: pack.unidad || 'unidad',
          es_servicio: pack.es_servicio || false,
          es_exento: pack.es_exento || false,
          disponible_para_venta: pack.disponible_para_venta !== false,
          activo: pack.activo !== false,
          id_categoria: pack.id_categoria || 1,
        };
      }
    }
    
    throw new Error('Producto no encontrado');
  },

  // 🔍 Búsqueda de Producto por Nombre (Para autocompletado)
  async buscarProductosPorNombre(nombre: string): Promise<ProductoFactura[]> {
    const response = await productoApi.get(`/productos/buscar?nombre=${encodeURIComponent(nombre)}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data.map((producto: any) => ({
        codigo_producto: producto.codigo,
        nombre_producto: producto.nombre,
        precio: producto.precio,
        codigo_barras: producto.codigo_barra_interno,
        descripcion: producto.descripcion,
        unidad: producto.unidad || 'unidad',
        es_servicio: producto.es_servicio || false,
        es_exento: producto.es_exento || false,
        disponible_para_venta: producto.disponible_para_venta !== false,
        activo: producto.activo !== false,
        id_categoria: producto.id_categoria || 1,
      }));
    }
    
    return [];
  }
};

export default productoService;