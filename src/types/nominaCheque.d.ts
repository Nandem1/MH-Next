export interface Cheque {
  id: string;
  numeroCorrelativo: string;
  estado: "DISPONIBLE" | "ASIGNADO" | "PAGADO";
  facturaAsociada?: {
    id: string;
    folio: string;
    proveedor: string;
    monto: number;
    estado: string;
    fechaIngreso: string;
  };
  fechaAsignacion?: string;
  fechaPago?: string;
}

export interface TrackingEnvio {
  id: string;
  estado: "EN_ORIGEN" | "EN_TRANSITO" | "RECIBIDA" | "ENTREGADA";
  localOrigen: string;
  localDestino?: string;
  fechaEnvio?: string;
  fechaRecepcion?: string;
  fechaEntrega?: string;
  observaciones?: string;
  enviadoPor?: string;
  recibidoPor?: string;
}

export interface NominaCheque {
  id: string;
  nombre: string;
  correlativoInicial: string;
  correlativoFinal: string;
  fechaCreacion: string;
  creadoPor: string;
  local: string;
  estado: "ACTIVA" | "COMPLETADA" | "CANCELADA";
  cheques: Cheque[];
  totalCheques: number;
  chequesDisponibles: number;
  chequesAsignados: number;
  chequesPagados: number;
  trackingEnvio?: TrackingEnvio;
}

export interface NominaChequeResponse {
  id: string;
  nombre: string;
  correlativo_inicial: string;
  correlativo_final: string;
  fecha_creacion: string;
  creado_por: string;
  local: string;
  estado: string;
  total_cheques: number;
  cheques_disponibles: number;
  cheques_asignados: number;
  cheques_pagados: number;
  tracking_envio?: {
    id: string;
    estado: string;
    local_origen: string;
    local_destino?: string;
    fecha_envio?: string;
    fecha_recepcion?: string;
    fecha_entrega?: string;
    observaciones?: string;
    enviado_por?: string;
    recibido_por?: string;
  };
}

export interface ChequeResponse {
  id: string;
  numero_correlativo: string;
  estado: string;
  factura_asociada?: {
    id: string;
    folio: string;
    proveedor: string;
    monto: number;
    estado: string;
    fecha_ingreso: string;
  };
  fecha_asignacion?: string;
  fecha_pago?: string;
}

export interface CrearNominaChequeRequest {
  nombre: string;
  correlativoInicial: string;
  local: string;
}

export interface UsuarioAuth {
  id: string;
  nombre: string;
  email: string;
  rol_id: number;
  local: string;
  local_nombre: string;
}

export interface FiltroNominas {
  nombre?: string;
  local?: string;
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
} 