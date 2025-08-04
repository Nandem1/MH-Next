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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api-beta";

// Función helper para construir URLs correctamente
const buildApiUrl = (endpoint: string): string => {



  
  const baseUrl = API_URL.endsWith('/api-beta') ? API_URL : `${API_URL}/api-beta`;
  const finalUrl = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  


  
  return finalUrl;
};

// Función helper para obtener headers con autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');



  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  

  
  return headers;
};

// Obtener todos los cheques con información de uso
export const getCheques = async (
  limit: number = 50,
  offset: number = 0
): Promise<ChequesResponse> => {
  try {
    const url = buildApiUrl('/cheques');



    
    const response = await axios.get<ChequesResponse>(url, {
      params: { limit, offset },
      headers: getAuthHeaders()
    });
    

    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo cheques:", error);
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
    throw new Error("No se pudieron cargar los cheques");
  }
};

// Obtener un cheque específico por ID
export const getChequeById = async (id: number): Promise<ChequeResponse> => {
  try {
    const response = await axios.get<ChequeResponse>(buildApiUrl(`/cheques/${id}`), {
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
    const response = await axios.get<ChequeResponse>(buildApiUrl(`/cheques/correlativo/${correlativo}`), {
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
    const response = await axios.post<ChequeResponse>(buildApiUrl('/cheques'), data, {
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
    const response = await axios.put<ChequeResponse>(buildApiUrl(`/cheques/${id}`), data, {
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
    await axios.delete(buildApiUrl(`/cheques/${id}`), {
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
    const response = await axios.get<ChequeResponse>(buildApiUrl(`/facturas/${facturaId}/cheque`), {
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
    const response = await axios.get<ChequesPorProveedorResponse>(buildApiUrl(`/cheques/proveedor/${idProveedor}`), {
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
    const response = await axios.get(buildApiUrl(`/cheques/proveedor/${idProveedor}/estadisticas`), {
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

    
    const response = await axios.get(buildApiUrl(`/cheques/${idCheque}/facturas`), {
      headers: getAuthHeaders()
    });
    

    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo facturas del cheque:", error);
    throw new Error("No se pudieron cargar las facturas del cheque");
  }
}; 

// Verificar si un cheque está asignado a alguna nómina
export const checkChequeAsignadoANomina = async (chequeId: number): Promise<boolean> => {
  try {

    
    // Hacemos una consulta para verificar si el cheque está en alguna nómina
    // Por ahora, vamos a hacer una consulta simple
    const response = await axios.get(buildApiUrl(`/cheques/${chequeId}/nominas`), {
      headers: getAuthHeaders()
    });
    

    
    // Si hay respuesta y tiene datos, significa que está asignado
    return response.data && response.data.success && response.data.data && response.data.data.length > 0;
  } catch (error) {
    // Si el endpoint no existe o hay error 404, asumimos que no está asignado
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      
      return false;
    }
    
    console.error("❌ Error verificando asignación a nómina:", error);
    // En caso de error, asumimos que no está asignado para no bloquear
    return false;
  }
};

// Obtener cheques disponibles para nóminas (no asignados a ninguna nómina)
export const getChequesDisponiblesParaNominas = async (
  limit: number = 50,
  offset: number = 0
): Promise<ChequesResponse> => {
  try {

    
    // Primero obtenemos todos los cheques
    const allCheques = await getCheques(limit, offset);
    
    if (!allCheques || !allCheques.data) {
      throw new Error("No se pudieron cargar los cheques");
    }
    

    
    // Verificamos cada cheque para ver si está asignado a alguna nómina
    const chequesDisponibles = [];
    
    for (const cheque of allCheques.data) {
      const estaAsignado = await checkChequeAsignadoANomina(cheque.id);
      

      
      if (!estaAsignado) {
        chequesDisponibles.push(cheque);
      }
    }
    

    
    return {
      success: true,
      data: chequesDisponibles,
      total: chequesDisponibles.length
    };
  } catch (error) {
    console.error("❌ Error obteniendo cheques disponibles para nóminas:", error);
    throw new Error("No se pudieron cargar los cheques disponibles para nóminas");
  }
};

// NUEVAS FUNCIONES PARA SISTEMA BINARIO

// Obtener cheques disponibles usando el nuevo endpoint
export const getChequesDisponibles = async (
  limit: number = 50,
  offset: number = 0
): Promise<ChequesResponse> => {
  try {
    console.log("🔄 [DEBUG] Obteniendo cheques disponibles:", { limit, offset });
    
    const response = await axios.get<ChequesResponse>(buildApiUrl('/cheques/disponibles'), {
      params: { limit, offset },
      headers: getAuthHeaders()
    });

    console.log("✅ [DEBUG] Cheques disponibles obtenidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [DEBUG] Error obteniendo cheques disponibles:", error);
    if (axios.isAxiosError(error)) {
      console.error("📊 [DEBUG] Detalles del error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
    }
    throw new Error("No se pudieron cargar los cheques disponibles");
  }
}; 
