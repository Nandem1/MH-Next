import { NominaCheque, NominaChequeResponse, ChequeResponse, CrearNominaChequeRequest, TrackingEnvio } from "@/types/nominaCheque";

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
      estado: response.tracking_envio.estado as "EN_ORIGEN" | "EN_TRANSITO" | "RECIBIDA" | "ENTREGADA",
      localOrigen: response.tracking_envio.local_origen,
      localDestino: response.tracking_envio.local_destino,
      fechaEnvio: response.tracking_envio.fecha_envio,
      fechaRecepcion: response.tracking_envio.fecha_recepcion,
      fechaEntrega: response.tracking_envio.fecha_entrega,
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

  // Asignar cheque a factura
  async asignarCheque(nominaId: string, chequeId: string, facturaId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/nominas-cheque/${nominaId}/cheques/${chequeId}/asignar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ factura_id: facturaId }),
      });

      if (!response.ok) {
        throw new Error("Error al asignar cheque");
      }
    } catch (error) {
      console.error("Error assigning cheque:", error);
      throw error;
    }
  },

  // Marcar cheque como pagado
  async marcarChequePagado(nominaId: string, chequeId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/nominas-cheque/${nominaId}/cheques/${chequeId}/pagar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al marcar cheque como pagado");
      }
    } catch (error) {
      console.error("Error marking cheque as paid:", error);
      throw error;
    }
  },

  // Obtener facturas disponibles para asignar
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