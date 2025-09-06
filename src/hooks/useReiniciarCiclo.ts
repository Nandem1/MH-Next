"use client";

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { gastosService, ReiniciarCicloResponse } from '../services/gastosService';

export const useReiniciarCiclo = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reiniciarCiclo = async (): Promise<ReiniciarCicloResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gastosService.reiniciarCiclo();
      
      // Invalidar solo las queries específicas necesarias después del reinicio
      // Esto actualiza la UI sin causar un "refresh" completo
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      queryClient.invalidateQueries({ queryKey: ['usuario-caja-chica'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-monetarias'] });
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    reiniciarCiclo,
    loading,
    error
  };
};
