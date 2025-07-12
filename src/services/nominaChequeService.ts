import { 
  NominaCheque, 
  NominaChequeResponse, 
  ChequeResponse, 
  CrearNominaChequeRequest, 
  CrearChequeRequest,
  AsignarChequeRequest,
  MarcarPagadoRequest,
  TrackingEnvio 
} from "@/types/nominaCheque";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Transformar respuesta del API a tipo interno
const transformNominaResponse = (response: NominaChequeResponse): NominaCheque => {
  return {
    id: response.id,
    nombre: response.nombre,
    correlativoInicial: response.correlativo_inicial,
    correlativoFinal: response.correlativo_final,
    fechaCreacion: response.fecha_creacion,
    creadoPor: response.creado_por,
    local: response.local,
    estado: response.estado as "ACTIVA" | "COMPLETADA" | "CANCELADA",
    cheques: [], // Se cargarán por separado
    totalCheques: response.total_cheques,
    chequesDisponibles: response.cheques_disponibles,
    chequesAsignados: response.cheques_asignados,
    chequesPagados: response.cheques_pagados,
          trackingEnvio: response.tracking_envio ? {
        id: response.tracking_envio.id,
        estado: response.tracking_envio.estado as "EN_ORIGEN" | "EN_TRANSITO" | "RECIBIDA",
        localOrigen: response.tracking_envio.local_origen,
        localDestino: response.tracking_envio.local_destino || "BALMACEDA 599",
        fechaEnvio: response.tracking_envio.fecha_envio,
        fechaRecepcion: response.tracking_envio.fecha_recepcion,
        observaciones: response.tracking_envio.observaciones,
        enviadoPor: response.tracking_envio.enviado_por,
        recibidoPor: response.tracking_envio.recibido_por,
      } : undefined,
  };
};

const transformChequeResponse = (response: ChequeResponse) => {
  return {
    id: response.id,
    numeroCorrelativo: response.numero_correlativo,
    estado: response.estado as "DISPONIBLE" | "ASIGNADO" | "PAGADO",
    facturaAsociada: response.factura_asociada ? {
      id: response.factura_asociada.id,
      folio: response.factura_asociada.folio,
      proveedor: response.factura_asociada.proveedor,
      monto: response.factura_asociada.monto,
      estado: response.factura_asociada.estado,
      fechaIngreso: response.factura_asociada.fecha_ingreso,
    } : undefined,
    fechaAsignacion: response.fecha_asignacion,
    fechaPago: response.fecha_pago,
  };
};

export const nominaChequeService = {
  // Obtener todas las nóminas
  async getNominas(): Promise<NominaCheque[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/nominas-cheque`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al obtener nóminas");
      }

      const data: NominaChequeResponse[] = await response.json();
      return data.map(transformNominaResponse);
    } catch (error) {
      console.error("Error fetching nominas:", error);
      throw error;
    }
  },

  // Obtener una nómina específica con sus cheques
  async getNomina(id: string): Promise<NominaCheque> {
    try {
      const [nominaResponse, chequesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/nominas-cheque/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }),
        fetch(`${API_BASE_URL}/nominas-cheque/${id}/cheques`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }),
      ]);

      if (!nominaResponse.ok || !chequesResponse.ok) {
        throw new Error("Error al obtener nómina");
      }

      const nominaData: NominaChequeResponse = await nominaResponse.json();
      const chequesData: ChequeResponse[] = await chequesResponse.json();

      const nomina = transformNominaResponse(nominaData);
      nomina.cheques = chequesData.map(transformChequeResponse);

      return nomina;
    } catch (error) {
      console.error("Error fetching nomina:", error);
      throw error;
    }
  },

  // Crear nueva nómina
  async crearNomina(request: CrearNominaChequeRequest): Promise<NominaCheque> {
    try {
      const correlativoFinal = (parseInt(request.correlativoInicial) + 9).toString().padStart(6, '0');
      
      const response = await fetch(`${API_BASE_URL}/nominas-cheque`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nombre: request.nombre,
          correlativo_inicial: request.correlativoInicial,
          correlativo_final: correlativoFinal,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear nómina");
      }

      const data: NominaChequeResponse = await response.json();
      return transformNominaResponse(data);
    } catch (error) {
      console.error("Error creating nomina:", error);
      throw error;
    }
  },

  // Crear cheque manualmente
  async crearCheque(request: CrearChequeRequest): Promise<ChequeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cheques`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          numero_correlativo: request.numeroCorrelativo,
          nomina_id: request.nominaId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear cheque");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating cheque:", error);
      throw error;
    }
  },

  // Asignar cheque a factura por folio
  async asignarCheque(nominaId: string, chequeId: string, request: AsignarChequeRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/nominas-cheque/${nominaId}/cheques/${chequeId}/asignar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          factura_folio: request.facturaFolio,
          monto_pagado: request.montoPagado,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al asignar cheque");
      }
    } catch (error) {
      console.error("Error assigning cheque:", error);
      throw error;
    }
  },

  // Marcar cheque como pagado con monto y fecha
  async marcarChequePagado(nominaId: string, chequeId: string, request: MarcarPagadoRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/nominas-cheque/${nominaId}/cheques/${chequeId}/pagar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          monto_pagado: request.montoPagado,
          fecha_pago: request.fechaPago,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al marcar cheque como pagado");
      }
    } catch (error) {
      console.error("Error marking cheque as paid:", error);
      throw error;
    }
  },

  // Buscar factura por folio (con debounce)
  async buscarFacturaPorFolio(folio: string): Promise<{ id: string; folio: string; proveedor: string; monto: number } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-beta/facturas/${folio}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Factura no encontrada
        }
        throw new Error("Error al buscar factura");
      }

      const data = await response.json();
      
      // La respuesta es un array, tomamos el primer elemento
      if (Array.isArray(data) && data.length > 0) {
        const factura = data[0];
        return {
          id: factura.id.toString(),
          folio: factura.folio,
          proveedor: factura.proveedor,
          monto: 0, // El API no devuelve monto, se puede agregar después
        };
      }
      
      return null; // No se encontró la factura
    } catch (error) {
      console.error("Error fetching factura by folio:", error);
      throw error;
    }
  },

  // Obtener facturas disponibles para asignar (mantener para compatibilidad)
  async getFacturasDisponibles(): Promise<{ id: string; folio: string; proveedor: string; monto: number }[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/facturas/disponibles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al obtener facturas disponibles");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching available facturas:", error);
      throw error;
    }
  },

  // Actualizar tracking de envío
  async actualizarTracking(nominaId: string, trackingData: Partial<TrackingEnvio>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/nominas-cheque/${nominaId}/tracking`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(trackingData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar tracking");
      }
    } catch (error) {
      console.error("Error updating tracking:", error);
      throw error;
    }
  },
}; 