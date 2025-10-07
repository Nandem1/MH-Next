import { useState, useRef, useCallback } from 'react';
import { productoService, ProductoFactura } from '@/services/productoService';

export const useProductoBusqueda = () => {
  const [productos, setProductos] = useState<ProductoFactura[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Flujo ultra-optimizado - búsqueda directa sin buffer
  const buscarProductoDirecto = useCallback(async (codigo: string): Promise<ProductoFactura | null> => {
    try {
      // Buscar producto directamente sin buffer
      const productoReal = await productoService.buscarProductoPorCodigo(codigo);
      setError(null);
      return productoReal;
    } catch (error) {
      console.error('Error buscando producto:', error);
      setError(`Producto no encontrado: ${codigo}`);
      return null;
    }
  }, []);

  // Búsqueda por nombre para autocompletado
  const buscarPorNombre = useCallback(async (nombre: string): Promise<ProductoFactura[]> => {
    if (!nombre.trim()) return [];
    
    try {
      setBuscando(true);
      const resultados = await productoService.buscarProductosPorNombre(nombre);
      return resultados;
    } catch (error) {
      console.error('Error buscando por nombre:', error);
      return [];
    } finally {
      setBuscando(false);
    }
  }, []);

  // Limpiar estado
  const limpiarBuffer = useCallback(() => {
    setProductos([]);
    setError(null);
  }, []);

  return {
    productos,
    buscando,
    error,
    buscarProductoDirecto,
    buscarPorNombre,
    limpiarBuffer,
  };
};
