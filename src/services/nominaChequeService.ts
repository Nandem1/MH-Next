import { 
  NominaCantera, 
  NominaCanteraResponse, 
  CrearNominaRequest, 
  AsignarChequeRequest, 
  ActualizarTrackingRequest,
  ChequeAsignadoResponse,
  TrackingEnvioResponse,
  FiltrosNominas,
  PaginationInfo
} from "@/types/nominaCheque";
import { getUsuarioAutenticado } from "@/services/authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Tipos para la respuesta del API
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface NominasResponse {
  data: NominaCanteraResponse[];
  pagination: PaginationInfo;
  filtros: FiltrosNominas;
}

// Función helper para obtener headers con autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper para manejar diferentes estructuras de respuesta
const parseNominasResponse = (responseData: ApiResponse<NominasResponse>): { data: NominaCanteraResponse[], pagination?: PaginationInfo, filtros?: FiltrosNominas } => {
  // Si responseData.data es directamente un array (estructura antigua)
  if (Array.isArray(responseData.data)) {
    return {
      data: responseData.data,
      pagination: { page: 1, limit: 50, total: responseData.data.length, hasNext: false },
      filtros: {}
    };
  }
  
  // Si responseData.data es un objeto con data, pagination, filtros (estructura nueva)
  if (responseData.data && typeof responseData.data === 'object' && responseData.data.data) {
    return {
      data: responseData.data.data,
      pagination: responseData.data.pagination,
      filtros: responseData.data.filtros
    };
  }
  
  // Si responseData.data es directamente el array (otra variante)
  if (Array.isArray(responseData.data)) {
    return {
      data: responseData.data,
      pagination: { page: 1, limit: 50, total: responseData.data.length, hasNext: false },
      filtros: {}
    };
  }
  
  throw new Error("Estructura de respuesta del API no reconocida");
};

// Transformar respuesta del API a tipo interno
const transformNominaResponse = (response: NominaCanteraResponse): NominaCantera => {
  
  const transformedTracking = response.tracking_envio ? {
    id: response.tracking_envio.id,
    estado: response.tracking_envio.estado as "EN_ORIGEN" | "EN_TRANSITO" | "RECIBIDA",
    localOrigen: response.tracking_envio.local_origen,
    localDestino: response.tracking_envio.local_destino,
    fechaEnvio: response.tracking_envio.fecha_envio,
    fechaRecepcion: response.tracking_envio.fecha_recepcion,
    observaciones: response.tracking_envio.observaciones,
    enviadoPor: response.tracking_envio.enviado_por,
    recibidoPor: response.tracking_envio.recibido_por,
  } : undefined;
  
  // Transformar cheques de forma simplificada
  const transformedCheques = response.cheques ? response.cheques.map(cheque => ({
    id: cheque.id.toString(),
    correlativo: cheque.correlativo,
    monto: cheque.monto,
    montoAsignado: cheque.monto_asignado,
    createdAt: cheque.fecha_asignacion,
    idUsuario: cheque.nombre_usuario_cheque,
    facturas: undefined,
    numeroCorrelativo: cheque.correlativo,
    estado: "ASIGNADO" as const,
    fechaAsignacion: cheque.fecha_asignacion,
    fechaPago: undefined,
    facturaAsociada: undefined,
  })) : undefined;
  

  
  return {
    id: response.id.toString(),
    numeroNomina: response.numero_nomina,
    fechaEmision: response.fecha_emision,
    local: response.local_origen,
    montoTotal: response.monto_total || 0,
    estado: response.estado as "pendiente" | "pagada" | "vencida",
    idUsuario: response.id_usuario.toString(),
    createdAt: response.created_at,
    updatedAt: response.updated_at,
    creadoPor: response.creado_por,
    trackingEnvio: transformedTracking,
    cheques: transformedCheques,
    
    // Propiedades adicionales para la tabla
    nombre: response.numero_nomina,
    correlativoInicial: "",
    correlativoFinal: "",
    totalCheques: response.cantidad_cheques || 0,
    chequesPagados: 0,
    fechaCreacion: response.created_at,
  };
};

export const nominaChequeService = {
  // Obtener nóminas con filtros y paginación
  async getNominas(filtros: FiltrosNominas = {}): Promise<{ nominas: NominaCantera[], pagination: PaginationInfo, filtros: FiltrosNominas }> {
    try {
      // Construir query string
      const params = new URLSearchParams();
      
      if (filtros.page) params.append('page', filtros.page.toString());
      if (filtros.limit) params.append('limit', filtros.limit.toString());
      if (filtros.local) params.append('local', filtros.local);
      if (filtros.usuario) params.append('usuario', filtros.usuario);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.numero_nomina) params.append('numero_nomina', filtros.numero_nomina);
      if (filtros.tracking_estado) params.append('tracking_estado', filtros.tracking_estado);
      if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
      if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api-beta/nominas${queryString ? `?${queryString}` : ''}`;



      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al obtener nóminas");
      }

      const responseData: ApiResponse<NominasResponse> = await response.json();

      
      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }

      // Usar el helper para parsear la respuesta
      const parsedResponse = parseNominasResponse(responseData);


      const transformedData = parsedResponse.data.map(transformNominaResponse);

      // Log detallado de cada nómina
      transformedData.forEach((nomina) => {
        if (nomina.trackingEnvio) {
          // Log tracking info if needed
        }
        
        if (nomina.cheques && nomina.cheques.length > 0) {
          nomina.cheques.forEach((cheque) => {
            if (cheque.facturas && cheque.facturas.length > 0) {
              cheque.facturas.forEach(() => {
                // Log factura info if needed
              });
            }
          });
        }
      });

      return {
        nominas: transformedData,
        pagination: parsedResponse.pagination || { page: 1, limit: 10, total: transformedData.length, hasNext: false },
        filtros: parsedResponse.filtros || {}
      };
    } catch (error) {
      console.error("Error fetching nominas:", error);
      throw error;
    }
  },

  // Obtener nómina por ID
  async getNomina(id: string): Promise<NominaCantera> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al obtener nómina");
      }

      const responseData: ApiResponse<NominaCanteraResponse> = await response.json();
      
      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }

      return transformNominaResponse(responseData.data);
    } catch (error) {
      console.error("Error fetching nomina:", error);
      throw error;
    }
  },

  // Obtener nómina completa con todos los detalles
  async getNominaCompleta(id: string): Promise<NominaCantera> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error("Error al obtener nómina completa");
      }

      const responseData: ApiResponse<NominaCanteraResponse> = await response.json();
      
      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }



      return transformNominaResponse(responseData.data);
    } catch (error) {
      console.error("Error fetching complete nomina:", error);
      throw error;
    }
  },

  // Crear nueva nómina
  async crearNomina(request: CrearNominaRequest): Promise<NominaCantera> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const usuario = await getUsuarioAutenticado();
      


      
      const payload = {
        numero_nomina: request.numeroNomina,
        fecha_emision: today,
        local_origen: request.localOrigen,
        creado_por: usuario?.user?.nombre || "Desconocido",
      };
      

      
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error("Error al crear nómina");
      }

      const responseData: ApiResponse<NominaCanteraResponse> = await response.json();

      
      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }

      return transformNominaResponse(responseData.data);
    } catch (error) {
      console.error("Error creating nomina:", error);
      throw error;
    }
  },

  // Asignar cheque a nómina
  async asignarCheque(nominaId: string, request: AsignarChequeRequest): Promise<void> {
    try {

      
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas/${nominaId}/cheques`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          id_cheque: request.idCheque,
          asignado_a_nomina: true, // Marcar como asignado a nómina
          monto_asignado: request.montoAsignado, // Enviar el monto real del cheque
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("Error al asignar cheque");
      }


    } catch (error) {
      console.error("Error assigning cheque:", error);
      throw error;
    }
  },

  // Obtener cheques de una nómina
  async getChequesNomina(nominaId: string): Promise<ChequeAsignadoResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas/${nominaId}/cheques`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al obtener cheques de la nómina");
      }

      const responseData: ApiResponse<ChequeAsignadoResponse[]> = await response.json();
      
      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }

      return responseData.data;
    } catch (error) {
      console.error("Error fetching nomina cheques:", error);
      throw error;
    }
  },

  // Obtener tracking de una nómina
  async getTracking(nominaId: string): Promise<TrackingEnvioResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas/${nominaId}/tracking`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No hay tracking
        }
        throw new Error("Error al obtener tracking");
      }

      const responseData: ApiResponse<TrackingEnvioResponse> = await response.json();
      
      if (!responseData.success) {
        return null; // No hay tracking
      }

      return responseData.data;
    } catch (error) {
      console.error("Error fetching tracking:", error);
      throw error;
    }
  },

  // Actualizar tracking de envío
  async actualizarTracking(nominaId: string, request: ActualizarTrackingRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas/${nominaId}/tracking`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          estado: request.estado,
          fechaEnvio: request.fechaEnvio,
          fechaRecepcion: request.fechaRecepcion,
          observaciones: request.observaciones,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar tracking");
      }
    } catch (error) {
      console.error("Error updating tracking:", error);
      throw error;
    }
  },

  // Crear tracking manualmente
  async crearTracking(nominaId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas/${nominaId}/tracking`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          estado: "EN_ORIGEN",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear tracking");
      }
    } catch (error) {
      console.error("Error creating tracking:", error);
      throw error;
    }
  },

  // Obtener historial de tracking
  async getTrackingHistorial(nominaId: string): Promise<unknown[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas/${nominaId}/tracking/historial`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al obtener historial de tracking");
      }

      const responseData: ApiResponse<unknown[]> = await response.json();
      
      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }

      return responseData.data;
    } catch (error) {
      console.error("Error fetching tracking historial:", error);
      throw error;
    }
  },

  // Obtener todas las nóminas con tracking
  async getNominasConTracking(): Promise<NominaCantera[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas-tracking`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Error al obtener nóminas con tracking: ${response.status} ${response.statusText}`);
      }

      const responseData: ApiResponse<NominasResponse> = await response.json();

      
      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }

      // Usar el helper para parsear la respuesta
      const parsedResponse = parseNominasResponse(responseData);


      return parsedResponse.data.map(transformNominaResponse);
    } catch (error) {
      console.error("Error fetching nominas with tracking:", error);
      throw error;
    }
  },

  // Obtener nóminas por estado de tracking
  async getNominasPorEstadoTracking(estado: string): Promise<NominaCantera[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas-tracking/estado/${estado}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Error al obtener nóminas por estado de tracking: ${response.status} ${response.statusText}`);
      }

      const responseData: ApiResponse<NominasResponse> = await response.json();

      
      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }

      // Usar el helper para parsear la respuesta
      const parsedResponse = parseNominasResponse(responseData);


      return parsedResponse.data.map(transformNominaResponse);
    } catch (error) {
      console.error("Error fetching nominas by tracking status:", error);
      throw error;
    }
  },
}; 
