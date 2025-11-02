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
  id: string | number; // Puede ser string para rendiciones activas (ej: "rend_xxx")
  rendicion_id: string; // ID de la rendición asociada
  usuario_id: number;
  nombre_usuario: string;
  monto_total_rendicion: number;
  cantidad_gastos: number;
  estado: 'activa' | 'generada' | 'reembolsada' | 'pendiente';
  observaciones: string | null;
  fecha_creacion: string;
  fecha_reembolso: string | null;
  fecha_reinicio_ciclo: string | null;
  observaciones_reinicio: string | null;
  tipo: 'nomina_generada' | 'rendicion_activa'; // ⭐ NUEVO CAMPO
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

// Estadísticas activas por local
export interface RendicionActiva {
  rendicion_id: string;
  usuario_id: number;
  nombre_usuario: string;
  monto_utilizado: number;
  cantidad_gastos: number;
  fecha_inicio: string;
}

export interface EstadisticasActivasPorLocal {
  local_id: number;
  nombre_local: string;
  total_rendiciones_activas: number;
  total_usuarios_activos: number;
  monto_total_utilizado: number;
  total_gastos_registrados: number;
  promedio_por_rendicion: number;
  rendiciones: RendicionActiva[];
}

export interface EstadisticasActivas {
  contexto: 'activas_por_local';
  por_local: EstadisticasActivasPorLocal[];
  resumen: {
    total_rendiciones_activas: number;
    total_usuarios_activos: number;
    monto_total_utilizado: number;
    total_gastos_registrados: number;
    promedio_por_rendicion: number;
  };
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
  estadisticas?: EstadisticasNominasGastos; // Estadísticas históricas
  estadisticas_historicas?: EstadisticasNominasGastos; // Cuando stats_tipo=ambas
  estadisticas_activas?: EstadisticasActivas; // Estadísticas activas por local
}

export interface NominaGastoDetalleResponse {
  success: boolean;
  data: NominaGasto;
}

export interface FiltrosNominasGastos {
  usuario_id?: number;
  local_id?: number;
  estado?: 'activa' | 'generada' | 'reembolsada' | 'pendiente';
  fecha_desde?: string;
  fecha_hasta?: string;
  monto_min?: number;
  monto_max?: number;
  pagina?: number;
  limite?: number;
  include_stats?: boolean;
  stats_tipo?: 'historicas' | 'activas' | 'ambas'; // ⭐ NUEVO: Tipo de estadísticas
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
  estadisticas: EstadisticasNominasGastos | null; // Estadísticas históricas (para compatibilidad)
  estadisticasActivas: EstadisticasActivas | null; // ⭐ NUEVO: Estadísticas activas
  pagination: PaginationMeta;
  filtros: FiltrosNominasGastos;
  loadNominas: (filtros?: FiltrosNominasGastos) => Promise<void>;
  loadNominaDetalle: (id: string | number) => Promise<NominaGasto>; // ID puede ser string
  loadEstadisticas: (statsTipo: 'historicas' | 'activas') => Promise<void>; // ⭐ Solo cargar estadísticas
  aplicarFiltros: (filtros: FiltrosNominasGastos) => void;
  limpiarFiltros: () => void;
  cambiarPagina: (pagina: number) => void;
  cambiarLimite: (limite: number) => void;
}