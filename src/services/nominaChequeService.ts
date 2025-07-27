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
  AsignarFacturaRequest
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
  console.log('🔍 Transformando respuesta de nómina:', {
    id: response.id,
    tipoNomina: response.tipo_nomina,
    cantidadCheques: response.cheques?.length || 0,
    cantidadFacturasAsignadas: response.facturas_asignadas?.length || 0,
    cheques: response.cheques?.map(c => ({ id: c.id, correlativo: c.correlativo, tieneFacturas: !!c.facturas?.length }))
  });
  // Log para debugging
  if (!response.id) {
    console.warn('⚠️ Nomina response missing id:', response);
  }
  
  if (response.cheques) {
    response.cheques.forEach((cheque, index) => {
      if (!cheque.id) {
        console.warn(`⚠️ Cheque ${index} missing id:`, cheque);
      }
    });
  }
  
  const transformedTracking = response.tracking_envio ? {
    id: response.tracking_envio.id || '',
    estado: response.tracking_envio.estado as "EN_ORIGEN" | "EN_TRANSITO" | "RECIBIDA",
    localOrigen: response.tracking_envio.local_origen || '',
    localDestino: response.tracking_envio.local_destino || '',
    fechaEnvio: response.tracking_envio.fecha_envio || '',
    fechaRecepcion: response.tracking_envio.fecha_recepcion || '',
    observaciones: response.tracking_envio.observaciones || '',
    enviadoPor: response.tracking_envio.enviado_por || '',
    recibidoPor: response.tracking_envio.recibido_por || '',
  } : undefined;
  
  // Transformar cheques de forma simplificada
  const transformedCheques = response.cheques ? response.cheques.map(cheque => ({
    id: cheque.id?.toString() || '0',
    correlativo: cheque.correlativo || '',
    monto: cheque.monto || 0,
    montoAsignado: cheque.monto_asignado || 0,
    createdAt: cheque.fecha_asignacion || '',
    idUsuario: cheque.nombre_usuario_cheque || '',
    facturas: undefined,
    numeroCorrelativo: cheque.correlativo || '',
    estado: "ASIGNADO" as const,
    fechaAsignacion: cheque.fecha_asignacion || '',
    fechaPago: undefined,
    facturaAsociada: undefined,
  })) : undefined;

  // Transformar facturas asignadas
  let transformedFacturas = response.facturas_asignadas ? response.facturas_asignadas.map(factura => ({
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

  // Si no hay facturas asignadas pero hay cheques con facturas asociadas, generar las facturas
  console.log('🔍 Verificando generación de facturas desde cheques:', {
    tieneTransformedFacturas: !!transformedFacturas,
    cantidadCheques: transformedCheques?.length || 0,
    tipoNomina: response.tipo_nomina
  });
  
  // Para nóminas tipo "cheques", por ahora solo loguear que no hay facturas asignadas
  if (!transformedFacturas && response.tipo_nomina === 'cheques') {
    console.log('🔍 Nómina tipo cheques sin facturas asignadas - esto puede ser normal');
  }
  
  if (!transformedFacturas && transformedCheques && transformedCheques.length > 0) {
    const facturasFromCheques: {
      id: string;
      folio: string;
      proveedor: string;
      monto: number;
      montoAsignado: number;
      estado: string;
      fechaIngreso: string;
      fechaAsignacion: string;
      idUsuario: string;
      nombreUsuario: string;
      notasCredito: undefined;
    }[] = [];
    
    transformedCheques.forEach(cheque => {
      // Buscar las facturas asociadas a este cheque en la respuesta original
      const chequeResponse = response.cheques?.find(c => c.id?.toString() === cheque.id);
      console.log('🔍 Cheque encontrado:', chequeResponse);
      if (chequeResponse?.facturas && chequeResponse.facturas.length > 0) {
        console.log('🔍 Facturas del cheque:', chequeResponse.facturas);
        chequeResponse.facturas.forEach(factura => {
          console.log('🔍 Procesando factura:', factura);
          facturasFromCheques.push({
            id: factura.id?.toString() || '0',
            folio: factura.folio || '',
            proveedor: factura.nombre_proveedor || '',
            monto: parseFloat(factura.monto?.toString() || '0'),
            montoAsignado: parseFloat(factura.monto_asignado?.toString() || '0'),
            estado: '1',
            fechaIngreso: '',
            fechaAsignacion: cheque.fechaAsignacion || '',
            idUsuario: cheque.idUsuario || '',
            nombreUsuario: cheque.idUsuario || '',
            notasCredito: undefined,
          });
        });
      } else {
        console.log('🔍 No se encontraron facturas para el cheque:', cheque.id);
      }
    });
    
    if (facturasFromCheques.length > 0) {
      transformedFacturas = facturasFromCheques;
      console.log('🔍 Generando facturas desde cheques:', facturasFromCheques);
    } else {
      console.log('🔍 No se pudieron generar facturas desde cheques');
    }
  }
  
  // Calcular monto total basado en los cheques y facturas asignados
  let montoTotalCalculado = typeof response.monto_total === 'string' ? parseFloat(response.monto_total) : (response.monto_total || 0);
  
  // Si hay cheques, sumar sus montos
  if (transformedCheques && transformedCheques.length > 0) {
    const totalCheques = transformedCheques.reduce((total, cheque) => {
      const montoAsignado = typeof cheque.montoAsignado === 'string' ? parseFloat(cheque.montoAsignado) : (cheque.montoAsignado || 0);
      return total + montoAsignado;
    }, 0);
    montoTotalCalculado += totalCheques;
    console.log('💰 Calculando monto total cheques:', {
      cheques: transformedCheques.map(c => ({ correlativo: c.correlativo, montoAsignado: c.montoAsignado })),
      totalCheques
    });
  }
  
  // Si hay facturas, sumar sus montos
  if (transformedFacturas && transformedFacturas.length > 0) {
    const totalFacturas = transformedFacturas.reduce((total, factura) => {
      const montoAsignado = typeof factura.montoAsignado === 'string' ? parseFloat(factura.montoAsignado) : (factura.montoAsignado || 0);
      return total + montoAsignado;
    }, 0);
    montoTotalCalculado += totalFacturas;
    console.log('💰 Calculando monto total facturas:', {
      facturas: transformedFacturas.map(f => ({ folio: f.folio, montoAsignado: f.montoAsignado })),
      totalFacturas
    });
  }
  
  // Usar el tipo de nómina que viene del backend
  const tipoNomina = response.tipo_nomina as "cheques" | "facturas" | "mixta" || "cheques";
  
  console.log('🔍 Tipo de nómina desde backend:', {
    id: response.id,
    tipoNomina,
    cantidadCheques: transformedCheques?.length || 0,
    cantidadFacturas: transformedFacturas?.length || 0
  });
  
  return {
    id: response.id?.toString() || '0',
    numeroNomina: response.numero_nomina || '',
    fechaEmision: response.fecha_emision || '',
    local: response.local_origen || '',
    montoTotal: montoTotalCalculado,
    estado: response.estado as "pendiente" | "pagada" | "vencida",
    idUsuario: response.id_usuario?.toString() || '0',
    createdAt: response.created_at || '',
    updatedAt: response.updated_at || '',
    creadoPor: response.creado_por || '',
    tipoNomina: tipoNomina, // Usar el tipo inferido
    trackingEnvio: transformedTracking,
    cheques: transformedCheques,
    facturas: transformedFacturas, // Agregar facturas transformadas
    
    // Propiedades adicionales para la tabla
    nombre: response.numero_nomina || '',
    correlativoInicial: "",
    correlativoFinal: "",
    totalCheques: response.cantidad_cheques || 0,
    chequesPagados: 0,
    totalFacturas: response.cantidad_facturas || 0,
    balance: response.balance || 0,
    fechaCreacion: response.created_at || '',
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

      // Log detallado de cada nómina para debugging
      transformedData.forEach((nomina) => {
        console.log('📊 Nómina en lista principal:', {
          id: nomina.id,
          numero: nomina.numeroNomina,
          tipo: nomina.tipoNomina,
          montoTotal: nomina.montoTotal,
          cantidadCheques: nomina.cheques?.length || 0,
          cantidadFacturas: nomina.facturas?.length || 0,
          tieneFacturasAsignadas: !!nomina.facturas && nomina.facturas.length > 0
        });
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

      // Log para debugging
      console.log('📋 Nomina response data:', responseData.data);
      console.log('📋 Cheques en response:', responseData.data.cheques);

      return transformNominaResponse(responseData.data);
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
      
      // Debug: Log de los datos recibidos
      console.log('🔍 Debug crearNomina:', {
        request,
        usuario: usuario?.user,
        localOrigen,
        requestNombre: request.nombre,
        requestFecha: request.fecha
      });
      
      const payload = {
        numero_nomina: request.nombre, // Cambiar nombre por numero_nomina
        fecha_emision: request.fecha, // Cambiar fecha por fecha_emision
        local_origen: localOrigen, // Agregar local_origen
        tipo_nomina: request.tipo_nomina || 'cheques',
        creado_por: usuario?.user?.nombre || "Desconocido",
      };

      // Debug: Log del payload que se envía
      console.log('📤 Payload enviado:', payload);
      
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

  // Obtener nómina con detalles completos (incluyendo facturas)
  async getNominaCompletaConFacturas(nominaId: string): Promise<NominaCantera> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/nominas/${nominaId}/completa`, {
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
      console.error("Error fetching complete nomina with invoices:", error);
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
