import axios from 'axios';
import {
  StockProducto,
  StockEntradaMultipleRequest,
  StockSalidaMultipleRequest,
  StockResponse,
  POSProductoResponse,
  ProductoArticulo,
  ProductoPack,
  StockLocalCompletoResponse,
} from '@/types/stock';

const API_BASE_URL = process.env.NEXT_PUBLIC_GO_API_URL || 'http://localhost:8080/api/v1';

// Configuración base de axios
const stockApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
stockApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
stockApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Stock API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const stockService = {
  // 🚀 Búsqueda Rápida de Producto por Código de Barras (POS) - USADO EN NUEVO MOVIMIENTO
  async getProductoByBarcode(barcode: string): Promise<StockProducto> {
    const response = await stockApi.get<POSProductoResponse>(`/pos/producto/${barcode}`);
    
    if (response.data.success && response.data.data.producto) {
      const producto = response.data.data.producto;
      
      // Helper para normalizar strings
      const normalizeString = (str: string) => str?.toUpperCase() || '';
      
      // Adaptar la respuesta del backend al formato interno
      if ('id' in producto) {
        // Es un artículo
        const articulo = producto as ProductoArticulo;
        return {
          codigo_producto: normalizeString(articulo.codigo),
          tipo_item: 'producto' as const,
          cantidad: 1,
          cantidad_minima: 0,
          nombre_producto: normalizeString(articulo.nombre),
          codigo_barras: normalizeString(articulo.codigo_barra_interno),
        };
      } else {
        // Es un pack
        const pack = producto as ProductoPack;
        return {
          codigo_producto: normalizeString(pack.codigo_articulo), // Usar el código del artículo individual
          tipo_item: 'producto' as const,
          cantidad: pack.cantidad_articulo, // Multiplicar por la cantidad del pack
          cantidad_minima: 0,
          nombre_producto: normalizeString(pack.nombre_articulo),
          codigo_barras: normalizeString(pack.cod_barra_articulo),
        };
      }
    }
    
    throw new Error('Producto no encontrado');
  },

  // 📦 Entrada Múltiple de Stock (Backend Go) - USADO EN NUEVO MOVIMIENTO
  async entradaMultiple(data: StockEntradaMultipleRequest): Promise<StockResponse> {
    const response = await stockApi.post('/stock/entrada-multiple', data);
    return response.data;
  },

  // 🛒 Salida Múltiple de Stock (Backend Go) - USADO EN NUEVO MOVIMIENTO
  async salidaMultiple(data: StockSalidaMultipleRequest): Promise<StockResponse> {
    const response = await stockApi.post('/stock/salida-multiple', data);
    return response.data;
  },

  // 📊 Obtener Stock Local Completo (Backend Go) - USADO EN STOCK GENERAL
  async getStockLocalCompleto(idLocal: number): Promise<StockLocalCompletoResponse> {
    const response = await stockApi.get<StockLocalCompletoResponse>(`/stock/local-completo/${idLocal}`);
    return response.data;
  }
};

export default stockService; 