// src/types/factura.d.ts

export interface FacturaResponse {
  id: number; // ID real de la base de datos (ahora siempre incluido)
  folio: string;
  proveedor: string;
  image_url: string;
  image_url_cloudinary: string;
  fecha_registro: string;
  nombre_local: string;
  id_local?: number; // Opcional: algunos endpoints pueden devolver solo id_local
  nombre_usuario: string;
  rut_proveedor?: string;
  monto?: number | string; // Campo real del monto desde el backend (puede venir como string)
  // Nuevas propiedades de método de pago desde el backend
  metodo_pago?: "POR_PAGAR" | "CHEQUE" | "TRANSFERENCIA" | "EFECTIVO";
  monto_pagado?: number | string; // Puede venir como string del backend
  cheque_correlativo?: string;
  id_proveedor?: number; // ID del proveedor para usar en endpoints
  // Nuevo campo para disponibilidad en nóminas
  asignado_a_nomina?: boolean; // Indica si la factura está asignada a una nómina
}

// Nueva interfaz específica para el endpoint de facturas disponibles
export interface FacturaDisponibleResponse {
  id: number;
  folio: string;
  monto: number;
  fecha_factura: string;
  estado: number;
  nombre_proveedor: string;
  rut_proveedor: string;
}

export interface Factura {
  id: string;
  folio: string;
  proveedor: string;
  local: string;
  estado: "BODEGA" | "SALA";
  fechaIngreso: string; // Formato ISO (YYYY-MM-DDTHH:mm:ss)
  image_url: string;
  image_url_cloudinary: string;
  nombre_usuario: string;
  rut_proveedor?: string;
  monto?: number; // Nuevo campo para el monto
  // Nuevos campos para método de pago
  metodo_pago: "POR_PAGAR" | "CHEQUE" | "TRANSFERENCIA" | "EFECTIVO";
  monto_pagado?: number;
  cheque_correlativo?: string; // Número de cheque cuando método_pago es "CHEQUE"
  isUpdating?: boolean; // Estado de actualización
  pendingMonto?: number; // Monto pendiente de confirmación
  pendingMetodoPago?: string; // Método de pago pendiente de confirmación
  id_proveedor?: number; // ID del proveedor para usar en endpoints
  // Nuevo campo para disponibilidad en nóminas
  asignado_a_nomina?: boolean; // Indica si la factura está asignada a una nómina
}

// Nueva estructura para cheques con múltiples facturas
export interface Cheque {
  id: number;
  correlativo: string;
  monto: number | string; // Monto total del cheque (puede venir como string)
  created_at: string;
  id_usuario: number;
  // Campos opcionales para consultas con información adicional
  monto_asignado?: number | string; // Monto total asignado a facturas (puede venir como string)
  cantidad_facturas?: number; // Número de facturas que usa este cheque
  nombre_usuario?: string; // Nombre del usuario que creó el cheque
  facturas?: FacturaChequeInfo[]; // Lista de facturas asociadas
  // Nuevo campo para sistema binario de asignación a nóminas
  asignado_a_nomina?: boolean; // Indica si el cheque está asignado a una nómina
}

// Información de factura asociada a un cheque
export interface FacturaChequeInfo {
  id_factura: number;
  monto_asignado: number; // Monto asignado de este cheque a esta factura
  folio: string;
  monto_factura: number; // Monto total de la factura
  proveedor: string;
}

// Tabla intermedia factura-cheque
export interface FacturaCheque {
  id: number;
  id_factura: number;
  id_cheque: number;
  monto_asignado: number; // Monto asignado de este cheque a esta factura
  created_at: string;
}

// Request para actualizar método de pago (compatible con nueva estructura)
export interface ActualizarMetodoPagoRequest {
  id: string;
  metodo_pago: "POR_PAGAR" | "CHEQUE" | "TRANSFERENCIA" | "EFECTIVO";
  monto_pagado?: number;
  cheque?: {
    correlativo: string;
    monto: number; // Monto a asignar de este cheque a esta factura
  };
}

// Nuevos requests para gestión de cheques
export interface CrearChequeRequest {
  correlativo: string;
  monto: number;
}

export interface ActualizarChequeRequest {
  correlativo?: string;
  monto?: number;
}

// Response para consultas de cheques
export interface ChequesResponse {
  success: boolean;
  data: Cheque[];
  total?: number;
}

// Response para consultas de cheques por proveedor
export interface ChequesPorProveedorResponse {
  success: boolean;
  data: {
    cheques: Cheque[];
    estadisticas: {
      nombre_proveedor: string;
      rut_proveedor: string;
      total_cheques: number;
      monto_total_cheques: number;
      monto_total_asignado: number;
      monto_disponible: number;
    };
    paginacion: {
      limit: number;
      offset: number;
      total_cheques: number;
    };
  };
}

export interface ChequeResponse {
  success: boolean;
  data: Cheque;
  message?: string;
}