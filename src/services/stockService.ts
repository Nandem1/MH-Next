import axios from "axios";
import { 
  StockEntradaRequest, 
  StockSalidaRequest, 
  StockEntradaMultipleRequest, 
  StockSalidaMultipleRequest,
  StockEntradaResponse,
  StockSalidaResponse,
  StockMultipleResponse,
  StockLocalResponse,
  StockBajoResponse,
  StockMovimientosResponse,
  StockProductosMovidosResponse,
  StockReporteResponse,
  StockProductoResponse
} from "@/types/stock";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper para headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const stockService = {
  // 1. Entrada Individual de Stock
  async entradaIndividual(request: StockEntradaRequest): Promise<StockEntradaResponse> {
    try {
      const response = await axios.post<StockEntradaResponse>(
        `${API_URL}/api-beta/stock/entrada`,
        request,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error en entrada individual:", error);
      throw error;
    }
  },

  // 2. Salida Individual de Stock
  async salidaIndividual(request: StockSalidaRequest): Promise<StockSalidaResponse> {
    try {
      const response = await axios.post<StockSalidaResponse>(
        `${API_URL}/api-beta/stock/salida`,
        request,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error en salida individual:", error);
      throw error;
    }
  },

  // 3. Entrada Múltiple de Stock (Tipo POS)
  async entradaMultiple(request: StockEntradaMultipleRequest): Promise<StockMultipleResponse> {
    try {
      const response = await axios.post<StockMultipleResponse>(
        `${API_URL}/api-beta/stock/entrada-multiple`,
        request,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error en entrada múltiple:", error);
      throw error;
    }
  },

  // 4. Salida Múltiple de Stock (Tipo POS)
  async salidaMultiple(request: StockSalidaMultipleRequest): Promise<StockMultipleResponse> {
    try {
      const response = await axios.post<StockMultipleResponse>(
        `${API_URL}/api-beta/stock/salida-multiple`,
        request,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error en salida múltiple:", error);
      throw error;
    }
  },

  // 5. Consultar Stock por Local
  async consultarStockLocal(idLocal: number): Promise<StockLocalResponse> {
    try {
      const response = await axios.get<StockLocalResponse>(
        `${API_URL}/api-beta/stock/local/${idLocal}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error consultando stock local:", error);
      throw error;
    }
  },

  // 6. Productos con Stock Bajo
  async consultarStockBajo(idLocal: number): Promise<StockBajoResponse> {
    try {
      const response = await axios.get<StockBajoResponse>(
        `${API_URL}/api-beta/stock/bajo-stock/${idLocal}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error consultando stock bajo:", error);
      throw error;
    }
  },

  // 7. Historial de Movimientos
  async consultarMovimientos(
    idLocal: number, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<StockMovimientosResponse> {
    try {
      const response = await axios.get<StockMovimientosResponse>(
        `${API_URL}/api-beta/stock/movimientos/${idLocal}`,
        {
          params: { limit, offset },
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error consultando movimientos:", error);
      throw error;
    }
  },

  // 8. Productos Más/Menos Movidos
  async consultarProductosMovidos(
    idLocal: number, 
    tipo: 'mas' | 'menos' = 'mas', 
    limit: number = 10
  ): Promise<StockProductosMovidosResponse> {
    try {
      const response = await axios.get<StockProductosMovidosResponse>(
        `${API_URL}/api-beta/stock/productos-movidos/${idLocal}`,
        {
          params: { tipo, limit },
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error consultando productos movidos:", error);
      throw error;
    }
  },

  // 9. Reporte Completo de Stock
  async consultarReporte(idLocal: number): Promise<StockReporteResponse> {
    try {
      const response = await axios.get<StockReporteResponse>(
        `${API_URL}/api-beta/stock/reporte/${idLocal}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error consultando reporte:", error);
      throw error;
    }
  },

  // 10. Consultar Stock de Producto Específico
  async consultarStockProducto(
    codigoProducto: string, 
    idLocal: number
  ): Promise<StockProductoResponse> {
    try {
      const response = await axios.get<StockProductoResponse>(
        `${API_URL}/api-beta/stock/producto/${codigoProducto}`,
        {
          params: { id_local: idLocal },
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error consultando stock producto:", error);
      throw error;
    }
  },

  // 11. Inicializar Stock (Primera Vez)
  async inicializarStock(request: {
    productos: Array<{
      codigo_producto: string;
      tipo_item: 'producto' | 'pack';
      cantidad_inicial: number;
      cantidad_minima: number;
    }>;
    id_local: number;
    id_usuario: number;
    observaciones?: string;
  }): Promise<StockMultipleResponse> {
    try {
      const response = await axios.post<StockMultipleResponse>(
        `${API_URL}/api-beta/stock/inicializar`,
        request,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error inicializando stock:", error);
      throw error;
    }
  }
}; 