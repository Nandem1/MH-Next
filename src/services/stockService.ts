import axios from 'axios';
import {
  StockProducto,
  StockEntradaMultipleRequest,
  StockSalidaMultipleRequest,
  StockEntradaRequest,
  StockSalidaRequest,
  StockLocalResponse,
  StockBajoResponse,
  StockMovimientosResponse,
  StockProductosMovidosResponse,
  StockReporteResponse,
  StockResponse,
  POSProductoResponse,
  ProductoArticulo,
  ProductoPack,
  FiltrosMovimientos,
  MovimientosResponse
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
  // 🔐 Autenticación
  async login(username: string, password: string) {
    const response = await stockApi.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  // 📦 Entrada Individual de Stock (Backend Go)
  async entradaIndividual(data: StockEntradaRequest): Promise<StockResponse> {
    const response = await stockApi.post('/stock/entrada', data);
    return response.data;
  },

  // 📤 Salida Individual de Stock (Backend Go)
  async salidaIndividual(data: StockSalidaRequest): Promise<StockResponse> {
    const response = await stockApi.post('/stock/salida', data);
    return response.data;
  },

  // 🛒 Entrada Múltiple de Stock (Backend Go)
  async entradaMultiple(data: StockEntradaMultipleRequest): Promise<StockResponse> {
    const response = await stockApi.post('/stock/entrada-multiple', data);
    return response.data;
  },

  // 🛒 Salida Múltiple de Stock (Backend Go)
  async salidaMultiple(data: StockSalidaMultipleRequest): Promise<StockResponse> {
    const response = await stockApi.post('/stock/salida-multiple', data);
    return response.data;
  },

  // 📊 Consultar Stock por Local (Backend Go)
  async getStockLocal(idLocal: number): Promise<StockLocalResponse> {
    const response = await stockApi.get(`/stock/local/${idLocal}`);
    return response.data;
  },

  // ⚠️ Productos con Stock Bajo (Backend Go)
  async getStockBajo(idLocal: number): Promise<StockBajoResponse> {
    const response = await stockApi.get(`/stock/bajo-stock/${idLocal}`);
    return response.data;
  },

  // 📈 Historial de Movimientos (Backend Go)
  async getMovimientos(idLocal: number, filtros?: Record<string, unknown>): Promise<StockMovimientosResponse> {
    const params = new URLSearchParams();
    
    if (filtros?.tipo_movimiento) {
      params.append('tipo', filtros.tipo_movimiento as string);
    }
    if (filtros?.fecha_desde) {
      params.append('fecha_desde', filtros.fecha_desde as string);
    }
    if (filtros?.fecha_hasta) {
      params.append('fecha_hasta', filtros.fecha_hasta as string);
    }
    if (filtros?.limit) {
      params.append('limit', filtros.limit.toString());
    }
    if (filtros?.offset) {
      params.append('offset', filtros.offset.toString());
    }

    const queryString = params.toString();
    const url = `/stock/movimientos/${idLocal}${queryString ? `?${queryString}` : ''}`;
    
    const response = await stockApi.get(url);
    return response.data;
  },

  // 📊 Productos Más/Menos Movidos (Backend Go)
  async getProductosMovidos(
    idLocal: number, 
    tipo: 'mas' | 'menos' = 'mas', 
    limit: number = 10
  ): Promise<StockProductosMovidosResponse> {
    const response = await stockApi.get(`/stock/productos-movidos/${idLocal}?tipo=${tipo}&limit=${limit}`);
    return response.data;
  },

  // 📋 Reporte Completo de Stock (Backend Go)
  async getReporteStock(idLocal: number): Promise<StockReporteResponse> {
    const response = await stockApi.get(`/stock/reporte/${idLocal}`);
    return response.data;
  },

  // 🔍 Consultar Stock de Producto Específico
  async getStockProducto(codigoProducto: string, idLocal: number): Promise<StockResponse> {
    const response = await stockApi.get(`/stock/producto/${codigoProducto}?id_local=${idLocal}`);
    return response.data;
  },

  // 🚀 Búsqueda Rápida de Producto por Código de Barras (POS)
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

  // 🏗️ Inicializar Stock (Primera Vez)
  async inicializarStock(data: {
    productos: Array<{
      codigo_producto: string;
      tipo_item?: 'producto' | 'pack';
      cantidad_inicial: number;
      cantidad_minima?: number;
    }>;
    id_local: number;
    id_usuario: number;
    observaciones?: string;
  }): Promise<StockResponse> {
    const response = await stockApi.post('/stock/inicializar', data);
    return response.data;
  },

  // 🏥 Health Check
  async healthCheck(): Promise<{ status: string; services: Record<string, unknown> }> {
    const response = await stockApi.get('/health');
    return response.data;
  },

  // 🔄 Movimientos con filtros avanzados (usando el endpoint de la documentación original)
  async getMovimientosAvanzados(filtros: FiltrosMovimientos): Promise<MovimientosResponse> {
    const params = new URLSearchParams();
    
    if (filtros.id_local) {
      params.append('local', filtros.id_local.toString());
    }
    if (filtros.tipo_movimiento) {
      params.append('tipo', filtros.tipo_movimiento);
    }
    if (filtros.fecha_desde) {
      params.append('fecha_desde', filtros.fecha_desde);
    }
    if (filtros.fecha_hasta) {
      params.append('fecha_hasta', filtros.fecha_hasta);
    }

    const queryString = params.toString();
    const url = `/movimientos${queryString ? `?${queryString}` : ''}`;
    
    const response = await stockApi.get(url);
    return response.data;
  },

  // 📊 Stock bajo (usando el endpoint de la documentación original)
  async getStockBajoOriginal(idLocal: number): Promise<StockBajoResponse> {
    const response = await stockApi.get(`/stock/bajo/${idLocal}`);
    return response.data;
  },

  // 🔍 Stock de producto específico (usando el endpoint de la documentación original)
  async getStockProductoOriginal(codigoProducto: string, idLocal: number): Promise<StockResponse> {
    const response = await stockApi.get(`/stock/producto/${codigoProducto}?local=${idLocal}`);
    return response.data;
  }
};

export default stockService; 