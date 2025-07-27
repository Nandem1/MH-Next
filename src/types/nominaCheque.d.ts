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
  tipoNomina: "cheques" | "facturas" | "mixta"; // Nuevo campo para nóminas híbridas
  cheques?: ChequeAsignado[];
  facturas?: FacturaAsignada[]; // Nuevo campo para facturas asignadas
  trackingEnvio?: TrackingEnvio;
  
  // Propiedades adicionales para la tabla
  nombre?: string; // Nombre de la nómina
  correlativoInicial?: string;
  correlativoFinal?: string;
  totalCheques?: number;
  chequesPagados?: number;
  totalFacturas?: number; // Nuevo campo
  balance?: number; // Nuevo campo para balance (facturas - cheques)
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

// Nuevo tipo para facturas asignadas a nóminas
export interface FacturaAsignada {
  id: string;
  folio: string;
  proveedor: string;
  monto: number;
  montoAsignado: number; // Monto asignado a la nómina
  estado: string;
  fechaIngreso: string;
  fechaAsignacion: string;
  idUsuario: string;
  nombreUsuario: string;
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
  nombre: string;
  fecha: string; // formato: YYYY-MM-DD
  tipo_nomina?: 'cheques' | 'facturas' | 'mixta'; // opcional, default: 'cheques'
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
  local_origen: string;
  creado_por: string;
  created_at: string;
  updated_at: string;
  nombre_usuario: string;
  id_usuario: number;
  monto_total: number;
  cantidad_cheques: number;
  tipo_nomina?: string; // Nuevo campo para nóminas híbridas
  cantidad_facturas?: number; // Nuevo campo
  total_facturas?: number; // Nuevo campo
  total_cheques?: number; // Nuevo campo
  balance?: number; // Nuevo campo
  cheques?: ChequeAsignadoResponse[];
  facturas?: FacturaAsignadaResponse[]; // Nuevo campo para facturas asignadas
  facturas_asignadas?: FacturaAsignadaResponse[]; // Campo para facturas asignadas en nóminas mixtas
  tracking_envio?: {
    id: string;
    estado: string;
    local_origen: string;
    local_destino: string;
    fecha_envio?: string;
    fecha_recepcion?: string;
    observaciones?: string;
    enviado_por?: string;
    recibido_por?: string;
  };
}

// Tipo para cheques asignados (estructura antigua)
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

// Tipo para cheques asignados (estructura nueva del backend)
export interface ChequeAsignadoResponseNuevo {
  id: number;
  id_cheque: number;
  monto_asignado: number;
  numero: string;
  monto: number;
  banco: string;
  estado: string;
  fecha_emision: string;
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

// Nuevos tipos para nóminas híbridas
export interface CrearNominaMixtaRequest {
  nombre: string;
  fecha: string; // formato: YYYY-MM-DD
  cheques: Array<{
    idCheque: number;
    montoAsignado: number;
  }>;
  facturas: Array<{
    idFactura: number;
    montoAsignado: number;
  }>;
}

export interface AsignarFacturaRequest {
  idFactura: number;
  montoAsignado: number;
}

export interface FacturaAsignadaResponse {
  id: number;
  id_factura: number;
  monto_asignado: number;
  created_at: string;
  folio: string;
  monto_factura: number;
  estado: number;
  fecha_factura: string;
  nombre_proveedor: string;
  rut_proveedor: string;
  nombre_local: string;
  nombre_usuario_factura: string;
}

// Nuevos tipos para respuestas del backend




export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
}

 