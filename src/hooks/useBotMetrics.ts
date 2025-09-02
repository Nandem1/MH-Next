"use client";

import { useState, useEffect } from "react";
import type { MetricsData } from "@/types/metrics";

export function useBotMetrics() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchBotMetrics = async () => {
      try {
        const botApiUrl = process.env.NEXT_PUBLIC_BOT_API_URL_HEALTH || 'https://mh-bot-production-756d.up.railway.app/health';
        const response = await fetch(botApiUrl, {
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
        let errorMessage = "Error al cargar métricas del bot";
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = "Timeout: El bot no respondió en 20 segundos";
          } else if (err.message.includes('Failed to fetch')) {
            errorMessage = "No se pudo conectar al bot de WhatsApp";
          } else {
            errorMessage = err.message;
          }
        }
        setError(errorMessage);
        setIsLoading(false);
        setRetryCount(prev => prev + 1);
      }
    };

    fetchBotMetrics();
    const interval = setInterval(() => {
      if (!error || retryCount < 3) {
        fetchBotMetrics();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [error, retryCount]);

  return { metrics, isLoading, error };
}
