import { useState, useEffect } from "react";
import { obtenerControlVencimientos } from "../services/vencimientosService";
import { Vencimiento } from "../types/vencimientos";

export const useVencimientos = () => {
  const [vencimientos, setVencimientos] = useState<Vencimiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVencimientos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await obtenerControlVencimientos();
      
      if (!response.success) {
        throw new Error(response.error || response.message || "Error al obtener vencimientos");
      }

      if (Array.isArray(response.data)) {
        setVencimientos(response.data);
      } else {
        setVencimientos([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setVencimientos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVencimientos();
  }, []);

  const refetch = () => {
    fetchVencimientos();
  };

  return {
    vencimientos,
    isLoading,
    error,
    refetch,
  };
}; 