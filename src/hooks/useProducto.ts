import { useState, useEffect, useCallback } from 'react';
import { buscarProductoPorCodigo, Producto } from '../services/productoService';

export const useProducto = () => {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codigoBarras, setCodigoBarras] = useState<string>('');

  const buscarProducto = useCallback(async (codigo: string) => {
    if (!codigo || codigo.length < 8) {
      setProducto(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await buscarProductoPorCodigo(codigo);
      
      if (response.success && response.data) {
        setProducto(response.data);
      } else {
        setProducto(null);
        setError('Producto no encontrado');
      }
    } catch (err) {
      console.log('🔍 Hook Debug - Error capturado:', err);
      setProducto(null);
      setError(err instanceof Error ? err.message : 'Error al buscar producto');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce para buscar producto después de 1.5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (codigoBarras) {
        buscarProducto(codigoBarras);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [codigoBarras, buscarProducto]);

  const limpiarProducto = useCallback(() => {
    setProducto(null);
    setError(null);
    setCodigoBarras('');
  }, []);

  return {
    producto,
    isLoading,
    error,
    codigoBarras,
    setCodigoBarras,
    buscarProducto,
    limpiarProducto,
  };
}; 