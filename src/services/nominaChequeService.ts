import { 
  NominaCantera, 
  NominaCanteraResponse, 
  CrearNominaRequest, 
  AsignarChequeRequest, 
  ActualizarTrackingRequest,
  ChequeAsignadoResponse,
  TrackingEnvioResponse,
  FiltrosNominas,
  PaginationInfo,
  CrearNominaMixtaRequest,
  AsignarFacturaRequest,
  NominaDetalleResponse,
  ChequeAsignado
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
  // Nueva estructura del backend
  nominas?: NominaCanteraResponse[];
  total?: number;
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
  
  // Nueva estructura del backend: { success: true, data: { nominas: [...], total: 1 } }
  if (responseData.data && typeof responseData.data === 'object' && responseData.data.nominas) {
    return {
      data: responseData.data.nominas,
      pagination: { 
        page: 1, 
        limit: 50, 
        total: responseData.data.total || responseData.data.nominas.length, 
        hasNext: false 
      },
      filtros: {}
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
  
  console.error('❌ Estructura no reconocida:', responseData);
  throw new Error("Estructura de respuesta del API no reconocida");
};

// Transformar respuesta del API a tipo interno
const transformNominaResponse = (response: NominaCanteraResponse): NominaCantera => {

  
  // Parsear monto total (puede venir como string desde el backend)
  const montoTotal = parseFloat(response.monto_total?.toString() || '0');
  
  // Determinar estado basado en tracking
  let estado: "pendiente" | "pagada" | "vencida" | "enviada" | "recibida" | "cancelada" = "pendiente";
  
  if (response.tracking_envio) {
    switch (response.tracking_envio.estado) {
      case "RECIBIDA":
        estado = "recibida";
        break;
      case "EN_TRANSITO":
        estado = "enviada";
        break;
      case "EN_ORIGEN":
      default:
        estado = "pendiente";
        break;
    }
  }
  

  
  // Transformar cheques si existen
  const transformedCheques = response.cheques ? response.cheques.map(cheque => ({
    id: cheque.id?.toString() || '0',
    correlativo: cheque.correlativo || '',
    monto: parseFloat(cheque.monto?.toString() || '0'),
    montoAsignado: parseFloat(cheque.monto_asignado?.toString() || '0'),
    createdAt: cheque.fecha_asignacion || '',
    idUsuario: cheque.nombre_usuario_cheque || '',
    nombreUsuario: cheque.nombre_usuario_cheque || '',
    fechaAsignacion: cheque.fecha_asignacion || '',
    facturas: undefined,
    numeroCorrelativo: cheque.correlativo || '',
    estado: "ASIGNADO" as const,
    fechaPago: undefined,
    facturaAsociada: undefined,
  })) : undefined;

  // Transformar facturas asignadas si existen
  const transformedFacturas = response.facturas_asignadas ? response.facturas_asignadas.map(factura => ({
    id: factura.id?.toString() || '0',
    folio: factura.folio || '',
    proveedor: factura.nombre_proveedor || '',
    monto: parseFloat(factura.monto_factura?.toString() || '0'),
    montoAsignado: parseFloat(factura.monto_asignado?.toString() || '0'),
    estado: factura.estado?.toString() || '1',
    fechaIngreso: factura.fecha_factura || '',
    fechaAsignacion: factura.created_at || '',
    idUsuario: factura.nombre_usuario_factura || '',
    nombreUsuario: factura.nombre_usuario_factura || '',
    notasCredito: undefined,
  })) : undefined;

  // Tracking para la lista de nóminas
  const trackingEnvio = response.tracking_envio ? {
    id: '', // En la lista no tenemos id de tracking
    estado: response.tracking_envio.estado as "EN_ORIGEN" | "EN_TRANSITO" | "RECIBIDA",
    localOrigen: response.tracking_envio.local_origen || '',
    localDestino: response.tracking_envio.local_destino || '',
    fechaEnvio: response.tracking_envio.fecha_envio || '',
    fechaRecepcion: response.tracking_envio.fecha_recepcion || '',
    observaciones: response.tracking_envio.observaciones || '',
    enviadoPor: response.tracking_envio.enviado_por || '',
    recibidoPor: response.tracking_envio.recibido_por || '',
  } : undefined;

  return {
    id: response.id?.toString() || '0',
    numeroNomina: response.numero_nomina || '',
    fechaEmision: response.fecha_emision || '',
    local: response.local_origen || '',
    montoTotal: montoTotal,
    estado: estado,
    idUsuario: response.id_usuario?.toString() || '0',
    createdAt: response.created_at || '',
    updatedAt: response.updated_at || '',
    nombreUsuario: response.nombre_usuario || '',
    tipoNomina: response.tipo_nomina as "cheques" | "facturas" | "mixta" || "cheques",
    cheques: transformedCheques,
    facturas: transformedFacturas,
    trackingEnvio: trackingEnvio,
    // Propiedades adicionales calculadas
    totalCheques: parseInt(response.cantidad_cheques?.toString() || '0'),
    totalFacturas: response.cantidad_facturas || 0,
    balance: 0, // Se calcula en el backend
    fechaCreacion: response.created_at || ''
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

      const responseData: NominaDetalleResponse = await response.json();
      
      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }



      // Transformar la respuesta del detalle
      const nominaData = responseData.data;
      
      // Parsear monto total directamente desde la respuesta
      const montoTotal = nominaData.monto_total || 0;
      
      // Determinar estado basado en tracking
      let estado: "pendiente" | "pagada" | "vencida" | "enviada" | "recibida" | "cancelada" = "pendiente";
      
      if (nominaData.tracking_envio) {
        switch (nominaData.tracking_envio.estado) {
          case "RECIBIDA":
            estado = "recibida";
            break;
          case "EN_TRANSITO":
            estado = "enviada";
            break;
          case "EN_ORIGEN":
          default:
            estado = "pendiente";
            break;
        }
      }
      


      // Extraer cheques únicos de las facturas que tienen cheque
      const chequesUnicos = new Map<number, ChequeAsignado>();
      
      nominaData.facturas?.forEach(factura => {
        if (factura.cheque) {
          const chequeId = factura.cheque.id;
          if (!chequesUnicos.has(chequeId)) {
            chequesUnicos.set(chequeId, {
              id: factura.cheque.id.toString(),
              correlativo: factura.cheque.correlativo,
              monto: factura.cheque.monto,
              montoAsignado: factura.cheque.monto_asignado,
              createdAt: factura.cheque.fecha_asignacion,
              idUsuario: factura.cheque.nombre_usuario,
              nombreUsuario: factura.cheque.nombre_usuario,
              fechaAsignacion: factura.cheque.fecha_asignacion,
              facturas: undefined,
              numeroCorrelativo: factura.cheque.correlativo,
              estado: "ASIGNADO" as const,
              fechaPago: undefined,
              facturaAsociada: undefined,
            });
          }
        }
      });

      const transformedCheques = Array.from(chequesUnicos.values());

      // Transformar facturas con la nueva estructura simplificada
      const transformedFacturas = nominaData.facturas?.map(factura => ({
        id: factura.id.toString(),
        folio: factura.folio,
        proveedor: factura.nombre_proveedor,
        monto: factura.monto,
        montoAsignado: factura.monto_asignado,
        estado: '1', // Estado por defecto
        fechaIngreso: factura.fecha_asignacion,
        fechaAsignacion: factura.fecha_asignacion,
        idUsuario: nominaData.id_usuario.toString(),
        nombreUsuario: nominaData.nombre_usuario,
        notasCredito: undefined,
        cheque_asignado: factura.cheque ? {
          id: factura.cheque.id,
          correlativo: factura.cheque.correlativo,
          monto: factura.cheque.monto,
          monto_asignado: factura.cheque.monto_asignado,
          nombre_usuario_cheque: factura.cheque.nombre_usuario,
          fecha_asignacion_cheque: factura.cheque.fecha_asignacion
        } : null
      })) || [];

      // Tracking para el detalle
      const trackingEnvio = nominaData.tracking_envio ? {
        id: '0', // No viene en la nueva estructura
        estado: nominaData.tracking_envio.estado as "EN_ORIGEN" | "EN_TRANSITO" | "RECIBIDA",
        localOrigen: nominaData.tracking_envio.local_origen,
        localDestino: nominaData.tracking_envio.local_destino,
        fechaEnvio: nominaData.tracking_envio.fecha_envio,
        fechaRecepcion: nominaData.tracking_envio.fecha_recepcion,
        observaciones: nominaData.tracking_envio.observaciones,
        enviadoPor: undefined,
        recibidoPor: undefined
      } : undefined;

      const nominaTransformada: NominaCantera = {
        id: nominaData.id.toString(),
        numeroNomina: nominaData.numero_nomina,
        fechaEmision: nominaData.fecha_emision,
        local: nominaData.local_origen,
        montoTotal: montoTotal,
        estado: estado,
        idUsuario: nominaData.id_usuario.toString(),
        createdAt: nominaData.created_at,
        updatedAt: nominaData.updated_at,
        nombreUsuario: nominaData.nombre_usuario,
        tipoNomina: nominaData.tipo_nomina as "cheques" | "facturas" | "mixta",
        cheques: transformedCheques.length > 0 ? transformedCheques : undefined,
        facturas: transformedFacturas.length > 0 ? transformedFacturas : undefined,
        trackingEnvio: trackingEnvio,
        // Propiedades adicionales calculadas
        totalCheques: nominaData.cantidad_cheques || 0,
        totalFacturas: nominaData.facturas?.length || 0,
        balance: 0, // Se calcula en el backend
        fechaCreacion: nominaData.created_at
      };



      return nominaTransformada;
    } catch (error) {
      console.error("Error fetching complete nomina:", error);
      throw error;
    }
  },

  // Crear nueva nómina
  async crearNomina(request: CrearNominaRequest): Promise<NominaCantera> {
    try {

      const usuario = await getUsuarioAutenticado();
      
      // Mapeo de locales para obtener el nombre del local
      const localMapping: Record<number, string> = {
        1: "LA CANTERA 3055",
        2: "LIBERTADOR 1476", 
        3: "BALMACEDA 599",
      };

      const localOrigen = usuario?.user?.id_local ? localMapping[usuario.user.id_local] : "Local desconocido";
      

      
      const payload = {
        numero_nomina: request.nombre, // Cambiar nombre por numero_nomina
        fecha_emision: request.fecha, // Cambiar fecha por fecha_emision
        local_origen: localOrigen, // Agregar local_origen
        tipo_nomina: request.tipo_nomina || 'cheques',
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

  // ===== NUEVOS MÉTODOS PARA NÓMINAS HÍBRIDAS =====

  // Crear nómina mixta
  async crearNominaMixta(data: CrearNominaMixtaRequest): Promise<NominaCantera> {
    try {
      const usuario = await getUsuarioAutenticado();
      
      // Mapeo de locales para obtener el nombre del local
      const localMapping: Record<number, string> = {
        1: "LA CANTERA 3055",
        2: "LIBERTADOR 1476", 
        3: "BALMACEDA 599",
      };

      const localOrigen = usuario?.user?.id_local ? localMapping[usuario.user.id_local] : "Local desconocido";
      
      const payload = {
        numero_nomina: data.nombre, // Cambiar nombre por numero_nomina
        fecha_emision: data.fecha, // Cambiar fecha por fecha_emision
        local_origen: localOrigen, // Agregar local_origen
        tipo_nomina: 'mixta', // Tipo específico para nóminas mixtas
        creado_por: usuario?.user?.nombre || "Desconocido",
        cheques: data.cheques,
        facturas: data.facturas,
      };

      const response = await fetch(`${API_BASE_URL}/api-beta/nominas/mixta`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error("Error al crear nómina mixta");
      }

      const responseData: ApiResponse<NominaCanteraResponse> = await response.json();
      
      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }

      return transformNominaResponse(responseData.data);
    } catch (error) {
      console.error("Error creating mixed nomina:", error);
      throw error;
    }
  },

  // Asignar facturas a nómina existente
  async asignarFacturasANomina(nominaId: string, facturas: AsignarFacturaRequest[]): Promise<NominaCantera> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas/${nominaId}/facturas`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ facturas }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error("Error al asignar facturas a nómina");
      }

      const responseData: ApiResponse<NominaCanteraResponse> = await response.json();
      
      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }

      return transformNominaResponse(responseData.data);
    } catch (error) {
      console.error("Error assigning invoices to nomina:", error);
      throw error;
    }
  },





  // Convertir nómina a mixta
  async convertirNominaAMixta(nominaId: string, facturas: AsignarFacturaRequest[]): Promise<NominaCantera> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas/${nominaId}/convertir-mixta`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ facturas }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error("Error al convertir nómina a mixta");
      }

      const responseData: ApiResponse<NominaCanteraResponse> = await response.json();
      
      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }

      return transformNominaResponse(responseData.data);
    } catch (error) {
      console.error("Error converting nomina to mixed:", error);
      throw error;
    }
  },

  // Obtener nóminas con filtro por tipo
  async getNominasPorTipo(tipo: string, filtros: FiltrosNominas = {}): Promise<{ nominas: NominaCantera[], pagination: PaginationInfo, filtros: FiltrosNominas }> {
    try {
      const params = new URLSearchParams();
      
      // Agregar filtro de tipo
      params.append('tipo', tipo);
      
      // Agregar otros filtros
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
        throw new Error("Error al obtener nóminas por tipo");
      }

      const responseData: ApiResponse<NominasResponse> = await response.json();

      if (!responseData.success) {
        throw new Error("La respuesta del API indica error");
      }

      const parsedResponse = parseNominasResponse(responseData);
      const transformedData = parsedResponse.data.map(transformNominaResponse);

      return {
        nominas: transformedData,
        pagination: parsedResponse.pagination || { page: 1, limit: 10, total: transformedData.length, hasNext: false },
        filtros: parsedResponse.filtros || {}
      };
    } catch (error) {
      console.error("Error fetching nominas by type:", error);
      throw error;
    }
  },

  // Obtener facturas disponibles
  async getFacturasDisponibles(): Promise<{ data: unknown[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/facturas/disponibles`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al obtener facturas disponibles");
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error fetching available invoices:", error);
      throw error;
    }
  },
}; 
