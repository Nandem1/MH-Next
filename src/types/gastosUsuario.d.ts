export interface GastoUsuario {
  id: string;
  descripcion: string;
  monto: number;
  fecha: string;
  cuenta_contable_id: number;
  cuenta_contable_nombre: string;
  local_asignado_id: number;        // 🆕 NUEVO
  local_asignado_nombre: string;    // 🆕 NUEVO
  comprobante_url?: string;
  observaciones?: string;
  usuario_id: number;
  rendicion_id: string;
  created_at: string;
}

export interface GastosUsuarioResponse {
  success: boolean;
  data: {
    gastos: GastoUsuario[];
    meta: {
      pagina: number;
      limite: number;
      total: number;
      totalPaginas: number;
    };
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}
