/**
 * Utilidades de validación para el sistema de rinde gastos
 */

import { CrearGastoRequest } from "@/services/gastosService";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validar datos para crear un gasto
 */
export const validarCrearGasto = (gasto: CrearGastoRequest): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validar descripción
  if (!gasto.descripcion || gasto.descripcion.trim().length === 0) {
    errors.push({
      field: 'descripcion',
      message: 'La descripción es obligatoria'
    });
  } else if (gasto.descripcion.trim().length < 3) {
    errors.push({
      field: 'descripcion',
      message: 'La descripción debe tener al menos 3 caracteres'
    });
  } else if (gasto.descripcion.trim().length > 255) {
    errors.push({
      field: 'descripcion',
      message: 'La descripción no puede exceder 255 caracteres'
    });
  }

  // Validar monto
  if (!gasto.monto || gasto.monto <= 0) {
    errors.push({
      field: 'monto',
      message: 'El monto debe ser mayor a 0'
    });
  } else if (gasto.monto > 50000000) { // 50 millones máximo
    errors.push({
      field: 'monto',
      message: 'El monto no puede exceder $50,000,000'
    });
  }

  // Validar fecha
  if (!gasto.fecha) {
    errors.push({
      field: 'fecha',
      message: 'La fecha es obligatoria'
    });
  }

  // Validar categoría
  const categoriasValidas = ['GASTOS_OPERACIONALES', 'GASTOS_GENERALES', 'OTROS'];
  if (!gasto.categoria || !categoriasValidas.includes(gasto.categoria)) {
    errors.push({
      field: 'categoria',
      message: 'Debe seleccionar una categoría válida'
    });
  }

  // Validar cuenta contable
  if (!gasto.cuenta_contable_id || gasto.cuenta_contable_id.length === 0) {
    errors.push({
      field: 'cuenta_contable_id',
      message: 'Debe seleccionar una cuenta contable'
    });
  }

  // Validar observaciones (opcional)
  if (gasto.observaciones && gasto.observaciones.length > 1000) {
    errors.push({
      field: 'observaciones',
      message: 'Las observaciones no pueden exceder 1000 caracteres'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Formatear monto para mostrar
 */
export const formatearMonto = (monto: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monto);
};

/**
 * Formatear fecha para mostrar
 */
export const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatear fecha y hora para mostrar
 */
export const formatearFechaHora = (fecha: string): string => {
  return new Date(fecha).toLocaleString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Validar que el usuario tenga saldo suficiente
 */
export const validarSaldoSuficiente = (montoGasto: number, saldoDisponible: number): boolean => {
  return saldoDisponible >= montoGasto;
};

/**
 * Calcular porcentaje de utilización de caja chica
 */
export const calcularPorcentajeUtilizacion = (montoUtilizado: number, montoFijo: number): number => {
  if (montoFijo === 0) return 0;
  return Math.round((montoUtilizado / montoFijo) * 100);
};

/**
 * Determinar estado de alerta basado en porcentaje de utilización
 */
export const determinarEstadoAlerta = (porcentajeUtilizado: number): 'normal' | 'alerta' | 'critico' => {
  if (porcentajeUtilizado >= 90) return 'critico';
  if (porcentajeUtilizado >= 75) return 'alerta';
  return 'normal';
};

/**
 * Validar filtros de búsqueda de gastos
 */
export const validarFiltrosGastos = (filtros: Record<string, unknown>): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validar fechas
  if (filtros.fechaDesde && filtros.fechaHasta) {
    const fechaDesde = new Date(filtros.fechaDesde as string);
    const fechaHasta = new Date(filtros.fechaHasta as string);

    if (fechaDesde > fechaHasta) {
      errors.push({
        field: 'fechaHasta',
        message: 'La fecha hasta debe ser posterior a la fecha desde'
      });
    }
  }

  // Validar paginación
  if (filtros.pagina && (filtros.pagina as number) < 1) {
    errors.push({
      field: 'pagina',
      message: 'La página debe ser mayor a 0'
    });
  }

  if (filtros.limite && ((filtros.limite as number) < 1 || (filtros.limite as number) > 100)) {
    errors.push({
      field: 'limite',
      message: 'El límite debe estar entre 1 y 100'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Obtener mensaje de error amigable para el usuario
 */
export const obtenerMensajeError = (error: Error): string => {
  const mensaje = error.message.toLowerCase();

  if (mensaje.includes('saldo insuficiente')) {
    return '💰 No hay suficiente saldo en caja chica para este gasto';
  }

  if (mensaje.includes('token') || mensaje.includes('autenticación')) {
    return '🔐 Tu sesión ha expirado. Por favor, inicia sesión nuevamente';
  }

  if (mensaje.includes('permisos')) {
    return '🚫 No tienes permisos para realizar esta acción';
  }

  if (mensaje.includes('conexión') || mensaje.includes('red')) {
    return '📡 Error de conexión. Verifica tu conexión a internet';
  }

  if (mensaje.includes('servidor')) {
    return '⚠️ Error del servidor. Por favor, intenta más tarde';
  }

  return error.message || '❌ Ha ocurrido un error inesperado';
};
