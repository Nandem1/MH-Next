"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getLocalesActivos, type Local } from '../constants/locales';

export const useLocales = () => {
  const { usuario } = useAuth();
  const [locales, setLocales] = useState<Local[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocales = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar el mapeo estático de locales en lugar de llamar al backend
      // Los IDs son fijos (1, 2, 3) pero los nombres se mapean correctamente
      const localesActivos = getLocalesActivos();
      setLocales(localesActivos);
      return localesActivos;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario?.usuario_id) {
      fetchLocales();
    }
  }, [usuario?.usuario_id]);

  return {
    locales,
    loading,
    error,
    refetch: fetchLocales,
  };
};
