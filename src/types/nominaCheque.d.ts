// Tipos para el sistema de nóminas simplificado
export interface NominaCantera {
  id: string;
  numeroNomina: string;
  fechaEmision: string;
  local: string; // Reemplaza fechaVencimiento
  montoTotal: number;
  estado: "pendiente" | "pagada" | "vencida";
  idUsuario: string;
  createdAt: string;
  updatedAt: string;
  creadoPor: string; // Nuevo campo
  cheques?: ChequeAsignado[];
  trackingEnvio?: TrackingEnvio;
  
  // Propiedades adicionales para la tabla
  nombre?: string; // Nombre de la nómina
  correlativoInicial?: string;
  correlativoFinal?: string;
  totalCheques?: number;
  chequesPagados?: number;
  fechaCreacion?: string; // Alias para createdAt
}

export interface ChequeAsignado {
  id: string;
  correlativo: string;
  monto: number;
  montoAsignado: number;
  createdAt: string;
  idUsuario: string;
  facturas?: FacturaAsociada[];
  
  // Propiedades adicionales para la tabla
  numeroCorrelativo?: string; // Alias para correlativo
  estado?: string; // Estado del cheque
  fechaAsignacion?: string;
  fechaPago?: string;
  facturaAsociada?: {
    folio: string;
    proveedor: string;
    monto: number;
    estado: string;
    fechaIngreso: string;
  };
}

export interface FacturaAsociada {
  id: string;
  folio: string;
  proveedor: string;
  monto: number;
  estado: string;
  fechaIngreso: string;
  notasCredito?: NotaCredito[];
}

export interface NotaCredito {
  id: string;
  folioNc: string;
  monto: number;
  fechaEmision: string;
  motivo: string;
}

export interface TrackingEnvio {
  id: string;
  estado: "EN_ORIGEN" | "EN_TRANSITO" | "RECIBIDA";
  localOrigen: string;
  localDestino: string;
  fechaEnvio?: string;
  fechaRecepcion?: string;
  observaciones?: string;
  enviadoPor?: string;
  recibidoPor?: string;
}

// Tipos para filtros y paginación
export interface FiltrosNominas {
  page?: number;
  limit?: number;
  local?: string;
  usuario?: string;
  estado?: string;
  numero_nomina?: string;
  tracking_estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  nombre?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
}

// Request types
export interface CrearNominaRequest {
  numeroNomina: string;
  localOrigen: string;
}

export interface AsignarChequeRequest {
  idCheque: string;
  asignado_a_nomina?: boolean; // Nuevo campo para sistema binario
  montoAsignado?: number; // Opcional ahora que usamos sistema binario
}

export interface CrearChequeRequest {
  numeroCorrelativo: string;
  nominaId?: string;
}

export interface MarcarPagadoRequest {
  montoPagado: number;
  fechaPago: string;
}

export interface ActualizarTrackingRequest {
  estado: "EN_TRANSITO" | "RECIBIDA";
  fechaEnvio?: string;
  fechaRecepcion?: string;
  observaciones?: string;
}

// Response types from API
export interface NominaCanteraResponse {
  id: number;
  numero_nomina: string;
  fecha_emision: string;
  estado: string;
  local_origen: string; // Campo que faltaba
  creado_por: string; // Campo que faltaba
  created_at: string;
  updated_at: string;
  nombre_usuario: string; // Campo que faltaba
  id_usuario: number; // Cambiado a number
  monto_total: number;
  cantidad_cheques: number; // Campo que faltaba
  cheques?: ChequeAsignadoResponse[]; // Cheques asignados a la nómina
  tracking_envio?: {
    id: string;
    estado: string;
    local_origen: string;
    local_destino: string;
    fecha_envio?: string;
    fecha_recepcion?: string;
    observaciones?: string;
    enviado_por?: string; // Actualizado para coincidir con el backend
    recibido_por?: string; // Actualizado para coincidir con el backend
  };
}

export interface ChequeAsignadoResponse {
  id: number;
  correlativo: string;
  monto: number;
  asignado_a_nomina: boolean;
  nombre_usuario_cheque: string;
  monto_asignado: number;
  fecha_asignacion: string;
  facturas?: {
    id: number;
    folio: string;
    monto: number;
    nombre_proveedor: string;
    monto_asignado: number;
    notas_credito: unknown[];
  }[];
}

export interface TrackingEnvioResponse {
  id: string;
  estado: string;
  local_origen: string;
  local_destino: string;
  fecha_envio?: string;
  fecha_recepcion?: string;
  observaciones?: string;
  enviado_por?: string;
  recibido_por?: string;
} 