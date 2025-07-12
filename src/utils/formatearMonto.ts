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