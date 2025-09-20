// src/types/nominasGastos.d.ts

export interface LocalAfectado {
  local_id: number;
  nombre_local: string;
  monto_local: number;
  cantidad_gastos: number;
}

export interface GastoIncluido {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  local_asignado_id: number;
  local_nombre: string;
  cuenta_contable_id: number;
  cuenta_contable_nombre: string;
  comprobante: string;
}

export interface NominaGasto {
  id: number;
  usuario_id: number;
  nombre_usuario: string;
  monto_total_rendicion: number;
  cantidad_gastos: number;
  estado: 'generada' | 'reembolsada' | 'pendiente';
  observaciones: string;
  fecha_creacion: string;
  fecha_reembolso: string | null;
  fecha_reinicio_ciclo: string;
  observaciones_reinicio: string;
  locales_afectados: LocalAfectado[];
  gastos_incluidos?: GastoIncluido[];
}

export interface TopUsuario {
  usuario_id: number;
  nombre_usuario: string;
  total_gastado: number;
}

export interface TopLocal {
  local_id: number;
  nombre_local: string;
  total_gastado: number;
}

export interface SubcategoriaTop {
  subcategoria: string;
  total: number;
  cantidad: number;
}

export interface CategoriaGasto {
  categoria_principal: string;
  categoria_nombre: string;
  total_gastado: number;
  cantidad_gastos: number;
  porcentaje: number;
  subcategorias_top: SubcategoriaTop[];
}

export interface EstadisticasNominasGastos {
  contexto: 'general' | 'usuario' | 'local' | 'usuario_local';
  total_gastado: number;
  total_gastos: number;
  promedio_gasto: number;
  primera_fecha: string;
  ultima_fecha: string;
  top_usuarios: TopUsuario[];
  top_locales: TopLocal[];
  por_categoria: CategoriaGasto[];
}

export interface PaginationMeta {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
  tieneSiguiente: boolean;
  tieneAnterior: boolean;
}

export interface NominasGastosResponse {
  success: boolean;
  data: NominaGasto[];
  meta: PaginationMeta;
  estadisticas?: EstadisticasNominasGastos;
}

export interface NominaGastoDetalleResponse {
  success: boolean;
  data: NominaGasto;
}

export interface FiltrosNominasGastos {
  usuario_id?: number;
  local_id?: number;
  estado?: 'generada' | 'reembolsada' | 'pendiente';
  fecha_desde?: string;
  fecha_hasta?: string;
  monto_min?: number;
  monto_max?: number;
  pagina?: number;
  limite?: number;
  include_stats?: boolean;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

// Tipos para el hook
export interface UseNominasGastosReturn {
  nominas: NominaGasto[];
  loading: boolean;
  error: string | null;
  estadisticas: EstadisticasNominasGastos | null;
  pagination: PaginationMeta;
  filtros: FiltrosNominasGastos;
  loadNominas: (filtros?: FiltrosNominasGastos) => Promise<void>;
  loadNominaDetalle: (id: number) => Promise<NominaGasto>;
  aplicarFiltros: (filtros: FiltrosNominasGastos) => void;
  limpiarFiltros: () => void;
  cambiarPagina: (pagina: number) => void;
  cambiarLimite: (limite: number) => void;
}