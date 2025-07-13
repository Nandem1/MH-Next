// src/services/chequeService.ts
import axios from "axios";
import { 
  ChequesResponse, 
  ChequeResponse, 
  CrearChequeRequest, 
  ActualizarChequeRequest,
  ChequesPorProveedorResponse
} from "@/types/factura";

interface EstadisticasProveedor {
  nombre_proveedor: string;
  rut_proveedor: string;
  total_cheques: number;
  monto_total_cheques: number;
  monto_total_asignado: number;
  monto_disponible: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Función helper para obtener headers con autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  console.log("🔑 Token obtenido de localStorage:", token ? "✅ Presente" : "❌ Ausente");
  console.log("🔑 Token (primeros 20 caracteres):", token ? token.substring(0, 20) + "..." : "No hay token");
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Obtener todos los cheques con información de uso
export const getCheques = async (
  limit: number = 50,
  offset: number = 0
): Promise<ChequesResponse> => {
  try {
    console.log("🔍 Llamando endpoint de cheques:", `${API_URL}/api-beta/cheques`);
    console.log("📋 Parámetros:", { limit, offset });
    
    const response = await axios.get<ChequesResponse>(`${API_URL}/api-beta/cheques`, {
      params: { limit, offset },
      headers: getAuthHeaders()
    });
    
    console.log("✅ Respuesta del backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo cheques:", error);
    if (axios.isAxiosError(error)) {
      console.error("📊 Detalles del error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
    }
    throw new Error("No se pudieron cargar los cheques");
  }
};

// Obtener un cheque específico por ID
export const getChequeById = async (id: number): Promise<ChequeResponse> => {
  try {
    const response = await axios.get<ChequeResponse>(`${API_URL}/api-beta/cheques/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo cheque:", error);
    throw new Error("No se pudo cargar el cheque");
  }
};

// Obtener un cheque por correlativo
export const getChequeByCorrelativo = async (correlativo: string): Promise<ChequeResponse> => {
  try {
    const response = await axios.get<ChequeResponse>(`${API_URL}/api-beta/cheques/correlativo/${correlativo}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo cheque por correlativo:", error);
    throw new Error("No se pudo cargar el cheque");
  }
};

// Crear un nuevo cheque
export const createCheque = async (data: CrearChequeRequest): Promise<ChequeResponse> => {
  try {
    const response = await axios.post<ChequeResponse>(`${API_URL}/api-beta/cheques`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error creando cheque:", error);
    throw new Error("No se pudo crear el cheque");
  }
};

// Actualizar un cheque existente
export const updateCheque = async (id: number, data: ActualizarChequeRequest): Promise<ChequeResponse> => {
  try {
    const response = await axios.put<ChequeResponse>(`${API_URL}/api-beta/cheques/${id}`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error actualizando cheque:", error);
    throw new Error("No se pudo actualizar el cheque");
  }
};

// Eliminar un cheque (solo si no tiene facturas asociadas)
export const deleteCheque = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api-beta/cheques/${id}`, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    console.error("Error eliminando cheque:", error);
    throw new Error("No se pudo eliminar el cheque");
  }
};

// Obtener información del cheque asociado a una factura
export const getChequeByFactura = async (facturaId: number): Promise<ChequeResponse> => {
  try {
    const response = await axios.get<ChequeResponse>(`${API_URL}/api-beta/facturas/${facturaId}/cheque`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo cheque de factura:", error);
    throw new Error("No se pudo obtener la información del cheque");
  }
}; 

// Obtener cheques por proveedor
export const getChequesByProveedor = async (
  idProveedor: number,
  limit: number = 50,
  offset: number = 0
): Promise<ChequesPorProveedorResponse> => {
  try {
    const response = await axios.get<ChequesPorProveedorResponse>(`${API_URL}/api-beta/cheques/proveedor/${idProveedor}`, {
      params: { limit, offset },
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo cheques por proveedor:", error);
    if (axios.isAxiosError(error)) {
      console.error("📊 Detalles del error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
    }
    throw new Error("No se pudieron cargar los cheques del proveedor");
  }
};

// Obtener estadísticas de cheques por proveedor
export const getEstadisticasChequesByProveedor = async (idProveedor: number): Promise<{ success: boolean; data: EstadisticasProveedor }> => {
  try {
    const response = await axios.get(`${API_URL}/api-beta/cheques/proveedor/${idProveedor}/estadisticas`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo estadísticas de cheques por proveedor:", error);
    throw new Error("No se pudieron cargar las estadísticas");
  }
}; 

// Obtener facturas de un cheque específico
export const getFacturasByCheque = async (idCheque: number): Promise<{ success: boolean; data: { facturas: Array<{ id_factura: number; folio: string; monto_asignado: number; monto_factura: number; id_proveedor: number; proveedor: string; rut_proveedor: string }> } }> => {
  try {
    console.log("🔍 Obteniendo facturas del cheque:", idCheque);
    
    const response = await axios.get(`${API_URL}/api-beta/cheques/${idCheque}/facturas`, {
      headers: getAuthHeaders()
    });
    
    console.log("✅ Facturas del cheque obtenidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo facturas del cheque:", error);
    throw new Error("No se pudieron cargar las facturas del cheque");
  }
}; 