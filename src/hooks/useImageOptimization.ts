import { useState, useEffect, useCallback } from 'react';

interface UseImageOptimizationOptions {
  src: string;
  priority?: boolean;
  preload?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function useImageOptimization({
  src,
  priority = false,
  preload = false,
  onLoad,
  onError,
}: UseImageOptimizationOptions) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Preload de imagen
  const preloadImage = useCallback((imageSrc: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageSrc;
    });
  }, []);

  // Cargar imagen con optimizaciones
  const loadImage = useCallback(async () => {
    if (!src) return;

    try {
      setIsLoading(true);
      setHasError(false);

      // Si es prioritaria, preload inmediatamente
      if (priority || preload) {
        await preloadImage(src);
      }

      setIsLoaded(true);
      onLoad?.();
    } catch (error) {
      console.error('Error loading image:', error);
      setHasError(true);
      onError?.();
    } finally {
      setIsLoading(false);
    }
  }, [src, priority, preload, preloadImage, onLoad, onError]);

  // Efecto para cargar imagen
  useEffect(() => {
    loadImage();
  }, [loadImage]);

  // Función para recargar imagen
  const reload = useCallback(() => {
    setIsLoaded(false);
    setHasError(false);
    setIsLoading(true);
    loadImage();
  }, [loadImage]);

  return {
    isLoaded,
    hasError,
    isLoading,
    reload,
  };
}

// Hook para gestión de caché de imágenes
export function useImageCache() {
  const [cache, setCache] = useState<Map<string, boolean>>(new Map());

  const addToCache = useCallback((src: string) => {
    setCache(prev => new Map(prev).set(src, true));
  }, []);

  const isCached = useCallback((src: string) => {
    return cache.has(src);
  }, [cache]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  return {
    addToCache,
    isCached,
    clearCache,
  };
} 