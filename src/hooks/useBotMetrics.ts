"use client";

export function useBotMetrics() {
  // TEMPORALMENTE DESHABILITADO - Mientras se corrige el bot
  // Retornar estado estático mientras se corrige el bot
  return { 
    metrics: null, // No hay métricas disponibles temporalmente
    isLoading: false, // No está cargando
    error: "Bot metrics temporarily disabled while being fixed" // Mensaje informativo
  };
}
