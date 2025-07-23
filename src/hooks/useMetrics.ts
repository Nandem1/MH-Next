"use client";

import { useState, useEffect } from "react";
import type { MetricsData } from "@/types/metrics";

export function useMetrics() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const url = `${apiUrl}/api-beta/monitoring/metrics`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(20000),
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setMetrics(data);
        setIsLoading(false);
        setError(null);
        setRetryCount(0);
      } catch (err) {
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
      }
    };
    fetchMetrics();
    const interval = setInterval(() => {
      if (!error || retryCount < 3) {
        fetchMetrics();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [error, retryCount]);

  return { metrics, isLoading, error };
} 