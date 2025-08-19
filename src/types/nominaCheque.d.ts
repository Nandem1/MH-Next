// Tipos para el sistema de nóminas simplificado
export interface NominaCantera {
  id: string;
  numeroNomina: string;
  fechaEmision: string;
  local: string; // Reemplaza fechaVencimiento
  montoTotal: number;
  estado: "pendiente" | "pagada" | "vencida" | "enviada" | "recibida" | "cancelada";
  idUsuario: string;
  createdAt: string;
  updatedAt: string;
  nombreUsuario: string; // Campo para mostrar el nombre del usuario
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
  nombreUsuario?: string; // Nuevo campo para mostrar en hover
  fechaAsignacion?: string; // Nuevo campo para mostrar en hover
  facturas?: FacturaAsociada[];
  
  // Propiedades adicionales para la tabla
  numeroCorrelativo?: string; // Alias para correlativo
  estado?: string; // Estado del cheque
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
  id_proveedor?: number; // ID del proveedor para filtrar cheques
  monto: number;
  montoAsignado: number; // Monto asignado a la nómina
  estado: string;
  fechaIngreso: string;
  fechaAsignacion: string;
  idUsuario: string;
  nombreUsuario: string;
  notasCredito?: NotaCredito[];
  // Campo para información del cheque asignado según la documentación
  cheque_asignado?: {
    id: number;
    correlativo: string;
    monto: number;
    monto_asignado: number;
    nombre_usuario_cheque: string;
    fecha_asignacion_cheque: string;
  } | null;
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
  // Nuevos campos del backend
  offset?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

// Request types
export interface CrearNominaRequest {
  nombre: string;
  fecha: string; // formato: YYYY-MM-DD
  tipo_nomina?: 'cheques' | 'facturas' | 'mixta'; // opcional, default: 'cheques'
}

export interface AsignarChequeRequest {
  idCheque: number;
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
// Tipo para facturas en el detalle de nómina (actualizado para nueva estructura simplificada)
export interface FacturaDetalleResponse {
  id: number;
  folio: string;
  monto: number;
  monto_asignado: number;
  fecha_asignacion: string;
  nombre_proveedor: string;
  id_proveedor: number;
  cheque: ChequeDetalleResponse | null; // Campo cheque que puede ser null o un objeto
}

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
  monto_total: number | string;
  cantidad_cheques: number | string;
  tipo_nomina?: string; // Nuevo campo para nóminas híbridas
  cantidad_facturas?: number; // Nuevo campo
  total_facturas?: number; // Nuevo campo
  total_cheques?: number; // Nuevo campo
  balance?: number; // Nuevo campo
  // Nuevos campos para la lista de nóminas
  monto_total_cheques?: number;
  monto_total_facturas?: number;
  // Campo de tracking para la lista de nóminas
  tracking_envio?: {
    id?: number;
    id_nomina?: number;
    estado: string;
    local_origen: string;
    local_destino: string;
    fecha_envio?: string | null;
    fecha_recepcion?: string | null;
    observaciones?: string | null;
    enviado_por?: string | null;
    recibido_por?: string | null;
    created_at?: string;
  };
  cheques?: ChequeAsignadoResponse[];
  facturas?: FacturaDetalleResponse[]; // Nuevo campo para facturas asignadas en detalle
  facturas_asignadas?: FacturaAsignadaResponse[]; // Campo para facturas asignadas en nóminas mixtas
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

// Nuevos tipos para la estructura de respuesta actualizada del backend (SIMPLIFICADA)
export interface NominaDetalleResponse {
  success: boolean;
  data: {
    id: number;
    numero_nomina: string;
    fecha_emision: string;
    estado: string;
    local_origen: string;
    creado_por: string;
    created_at: string;
    updated_at: string;
    tipo_nomina: string;
    nombre_usuario: string;
    id_usuario: number;
    monto_total: number;
    cantidad_cheques: number;
    
    // Solo facturas con cheque opcional
    facturas: FacturaDetalleResponse[];
    
    // Tracking simplificado
    tracking_envio?: {
      estado: string;
      created_at: string;
      fecha_envio?: string;
      local_origen: string;
      local_destino: string;
      observaciones?: string;
      fecha_recepcion?: string;
    };
  };
}

// Tipo para cheques en la nueva estructura simplificada
export interface ChequeDetalleResponse {
  id: number;
  monto: number;
  correlativo: string;
  monto_asignado: number;
  nombre_usuario: string;
  fecha_asignacion: string;
}

export interface ResumenNominaResponse {
  cantidad_cheques: number;
  cantidad_facturas: number;
  cantidad_facturas_sin_cheque: number;
  cantidad_facturas_con_cheque: number;
  monto_total_asignado: number | string; // Puede venir como string desde el API
  monto_total_cheques: number | string; // Puede venir como string desde el API
  monto_total_facturas: number | string; // Puede venir como string desde el API
  monto_total_notas_credito: number | string; // Puede venir como string desde el API
  monto_neto: number | string; // Puede venir como string desde el API
  balance_valido: boolean;
  diferencia: number | string; // Puede venir como string desde el API
  porcentaje_asignado: number;
}

// Nuevos tipos para el endpoint específico de asignar cheque a factura
export interface AsignarChequeAFacturaRequest {
  correlativo: string;
  monto: number;
}

export interface AsignarChequeAFacturaResponse {
  success: boolean;
  message: string;
  data: {
    cheque: {
      id: number;
      correlativo: string;
      monto: number;
      asignado_a_nomina: boolean;
      nombre_usuario: string;
      monto_asignado: number;
      cantidad_facturas: number;
    };
    factura: {
      id: number;
      folio: string;
      monto: number;
      nombre_proveedor: string;
    };
    nomina: {
      id: number;
      tipo_nomina_actualizado: string;
    };
    asignacion: {
      monto_asignado: number;
      correlativo: string;
    };
  };
}

 