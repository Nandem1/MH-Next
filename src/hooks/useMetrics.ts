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
    total_requests: number;
    slow_requests_count: number;
    errors_count: number;
    top_endpoints: Array<{
      endpoint: string;
      count: number;
      avgTime: number;
    }>;
  };
  performance: {
    avgResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number | null;
    avg_response_time_ms: string;
    max_response_time_ms: string;
    min_response_time_ms: string;
  };
  cache: {
    connected: boolean;
    totalKeys: number;
    byPrefix: Record<string, number>;
    status: string;
    hit_rate_percentage: string;
  };
  database: {
    activeConnections: number;
    totalQueries: number;
    slowQueries: Array<{
      query: string;
      executionTime: number;
      timestamp: string;
    }>;
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
  timestamp: string;
  redis: {
    connected: boolean;
    keys: number;
    memory: string;
    status: string;
    memory_mb: string;
  };
  version: string;
  generated_by: string;
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Usar la URL de la API configurada (que será redirigida por next.config.ts)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        
        // Usar /api-beta/ para que use el rewrite a tu backend de Railway
        const url = `${apiUrl}/api-beta/monitoring/metrics`;
        
        console.log(`[Metrics] Fetching from: ${url} (attempt ${retryCount + 1})`);
        
        const startTime = Date.now();
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Timeout optimizado para Railway (más generoso)
          signal: AbortSignal.timeout(20000), // 20 segundos timeout para Railway
        });
        
        const endTime = Date.now();
        console.log(`[Metrics] Response time: ${endTime - startTime}ms`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('[Metrics] Data received successfully:', data);
        
        setMetrics(data);
        setIsLoading(false);
        setError(null);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        console.error('[Metrics] Error fetching metrics:', err);
        
        // Manejar diferentes tipos de errores
        let errorMessage = "Error al cargar métricas";
        
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = "Timeout: El servidor no respondió en 20 segundos";
          } else if (err.message.includes('Failed to fetch')) {
            errorMessage = "No se pudo conectar al servidor de métricas";
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
        setIsLoading(false);
        setRetryCount(prev => prev + 1);
        
        // En producción, reducir la frecuencia de polling si hay errores
        if (process.env.NODE_ENV === 'production' && retryCount > 2) {
          console.warn('[Metrics] Too many retries, reducing polling frequency');
        }
      }
    };

    // Cargar métricas iniciales
    fetchMetrics();

    // Polling optimizado para Railway: 10 segundos (coincide con WebSocket refresh)
    const interval = setInterval(() => {
      if (!error || retryCount < 3) { // Continuar intentando hasta 3 errores
        fetchMetrics();
      } else {
        console.warn('[Metrics] Stopping polling due to persistent errors');
      }
    }, 10000); // 10 segundos para coincidir con Railway

    return () => clearInterval(interval);
  }, [error, retryCount]);

  return { metrics, isLoading, error };
} 