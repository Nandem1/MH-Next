// src/utils/formatearMonto.ts

/**
 * Formatea un monto en pesos chilenos
 * @param monto - El monto a formatear
 * @returns String formateado (ej: "$150.000")
 */
export function formatearMonto(monto: number | undefined | null): string {
  if (monto === undefined || monto === null || monto === 0) {
    return "$0";
  }
  
  // Redondear a números enteros (sin decimales)
  const montoEntero = Math.round(monto);
  
  // Formatear con separadores de miles
  return `$${montoEntero.toLocaleString('es-CL')}`;
}

/**
 * Convierte un monto a número entero (redondeado)
 * @param monto - El monto a convertir (puede ser number, string, undefined o null)
 * @returns Número entero
 */
export function montoAEntero(monto: number | string | undefined | null): number {
  if (monto === undefined || monto === null) {
    return 0;
  }
  
  // Si es string, convertir a número
  if (typeof monto === 'string') {
    const montoNumero = parseFloat(monto);
    return isNaN(montoNumero) ? 0 : Math.round(montoNumero);
  }
  
  // Si es número, redondear
  return Math.round(monto);
}

/**
 * Convierte un string de monto a número entero
 * @param montoString - El string del monto (puede incluir "$", ",", etc.)
 * @returns Número entero
 */
export function stringMontoAEntero(montoString: string): number {
  if (!montoString || montoString.trim() === "") {
    return 0;
  }
  
  // Remover caracteres no numéricos excepto punto y coma
  const montoLimpio = montoString.replace(/[^\d.,]/g, '');
  
  // Convertir a número
  const monto = parseFloat(montoLimpio.replace(',', '.'));
  
  // Verificar si es un número válido
  if (isNaN(monto)) {
    return 0;
  }
  
  // Redondear a entero
  return Math.round(monto);
} 

// Formatear monto a pesos chilenos sin decimales
export const formatearMontoPesos = (monto: number | string): string => {
  const numMonto = typeof monto === 'string' ? parseFloat(monto) || 0 : monto || 0;
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numMonto);
}; 