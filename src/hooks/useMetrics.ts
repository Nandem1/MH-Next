"use client";

import { useState, useEffect } from "react";

interface MetricsData {
  requests: {
    total: number;
    byEndpoint: Record<string, {
      count: number;
      avgTime: number;
      totalTime: number;
    }>;
    slowRequests: Array<{
      endpoint: string;
      responseTime: number;
      timestamp: string;
    }>;
    errors: Array<{
      endpoint: string;
      statusCode: number;
      timestamp: string;
    }>;
  };
  performance: {
    avgResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number;
  };
  cache: {
    hitRate: number;
    totalHits: number;
    totalMisses: number;
    memoryUsage: number;
    connected: boolean;
    totalKeys: number;
    byPrefix: Record<string, number>;
  };
  database: {
    activeConnections: number;
    totalQueries: number;
    slowQueries: Array<{
      query: string;
      executionTime: number;
      timestamp: string;
    }>;
  };
  system: {
    memoryUsage: string;
    uptime: number;
    cpuUsage: string;
  };
  timestamp: string;
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Usar la URL de la API configurada (que será redirigida por next.config.ts)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        
        // Usar /api-beta/ para que use el rewrite a tu backend de Railway
        const url = `${apiUrl}/api-beta/monitoring/metrics`;
        
        console.log('Fetching metrics from:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Agregar timeout para evitar esperas infinitas
          signal: AbortSignal.timeout(10000), // 10 segundos timeout
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Metrics received:', data);
        
        setMetrics(data);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        
        // Manejar diferentes tipos de errores
        let errorMessage = "Error al cargar métricas";
        
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = "Timeout: El servidor no respondió en 10 segundos";
          } else if (err.message.includes('Failed to fetch')) {
            errorMessage = "No se pudo conectar al servidor de métricas";
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
        setIsLoading(false);
        
        // En producción, no seguir intentando si hay errores persistentes
        if (process.env.NODE_ENV === 'production') {
          console.warn('Stopping metrics polling due to persistent errors');
          return;
        }
      }
    };

    // Cargar métricas iniciales
    fetchMetrics();

    // Solo continuar polling si no hay errores persistentes
    const interval = setInterval(() => {
      if (!error) {
        fetchMetrics();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [error]);

  return { metrics, isLoading, error };
} 