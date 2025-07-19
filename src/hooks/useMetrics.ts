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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/monitoring/metrics`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMetrics(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError(err instanceof Error ? err.message : "Error al cargar métricas");
        setIsLoading(false);
      }
    };

    // Cargar métricas iniciales
    fetchMetrics();

    // Actualizar métricas cada 5 segundos (coincide con WebSocket)
    const interval = setInterval(fetchMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  return { metrics, isLoading, error };
} 