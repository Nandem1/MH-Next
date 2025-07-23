"use client";

import { useState, useEffect } from "react";

interface GoMetricsData {
  requests: {
    total: number;
    byEndpoint: Record<string, unknown>;
    slowRequests: unknown;
    errors: unknown;
    total_requests: number;
    slow_requests_count: number;
    errors_count: number;
    top_endpoints: unknown;
  };
  performance: {
    avgResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number;
    avg_response_time_ms: string;
    max_response_time_ms: string;
    min_response_time_ms: string;
  };
  cache: {
    connected: boolean;
    totalKeys: number;
    byPrefix: {
      product: number;
    };
    hitRate: number;
    status: string;
    hit_rate_percentage: string;
    total_hits: number;
    total_misses: number;
    total_requests: number;
  };
  database: {
    activeConnections: number;
    totalQueries: number;
    slowQueries: unknown[];
    status: string;
    active_connections: number;
  };
  system: {
    memoryUsage: string;
    cpuUsage: string;
    uptime: number;
    memory: {
      heapUsed: string;
      heapTotal: string;
      external: string;
      rss: string;
    };
    cpu: {
      usage_percentage: string;
      user_time: string;
      system_time: string;
    };
    uptime_hours: string;
    node_version: string;
    platform: string;
    environment: string;
  };
  redis: {
    connected: boolean;
    keys: number;
    memory: string;
    status: string;
    memory_mb: string;
  };
  timestamp: string;
  version: string;
  generated_by: string;
}

export function useGoMetrics() {
  const [metrics, setMetrics] = useState<GoMetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Usar la URL del backend Go configurada (ya incluye /api/v1/)
        const apiUrl = process.env.NEXT_PUBLIC_GO_API_URL || 'http://localhost:8080';
        
        // Endpoint específico del servidor Go (sin duplicar /api/v1/)
        const url = `${apiUrl}/monitoring/metrics`;
        
        console.log(`[Go Metrics] Fetching from: ${url} (attempt ${retryCount + 1})`);
        
        const startTime = Date.now();
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Timeout optimizado para el backend Go
          signal: AbortSignal.timeout(15000), // 15 segundos timeout
        });
        
        const endTime = Date.now();
        console.log(`[Go Metrics] Response time: ${endTime - startTime}ms`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('[Go Metrics] Data received successfully:', data);
        
        setMetrics(data);
        setIsLoading(false);
        setError(null);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        console.error('[Go Metrics] Error fetching metrics:', err);
        
        // Manejar diferentes tipos de errores
        let errorMessage = "Error al cargar métricas del servidor Go";
        
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = "Timeout: El servidor Go no respondió en 15 segundos";
          } else if (err.message.includes('Failed to fetch')) {
            errorMessage = "No se pudo conectar al servidor Go de métricas";
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
        setIsLoading(false);
        setRetryCount(prev => prev + 1);
        
        // En producción, reducir la frecuencia de polling si hay errores
        if (process.env.NODE_ENV === 'production' && retryCount > 2) {
          console.warn('[Go Metrics] Too many retries, reducing polling frequency');
        }
      }
    };

    // Cargar métricas iniciales
    fetchMetrics();

    // Polling optimizado para el servidor Go: 10 segundos
    const interval = setInterval(() => {
      if (!error || retryCount < 3) { // Continuar intentando hasta 3 errores
        fetchMetrics();
      } else {
        console.warn('[Go Metrics] Stopping polling due to persistent errors');
      }
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [error, retryCount]);

  return { metrics, isLoading, error };
} 