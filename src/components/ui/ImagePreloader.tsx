"use client";

import { useEffect } from 'react';

interface ImagePreloaderProps {
  images: string[];
  priority?: boolean;
}

export function ImagePreloader({ images, priority = false }: ImagePreloaderProps) {
  useEffect(() => {
    if (!images.length) return;

    const preloadImages = async () => {
      const promises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        if (priority) {
          // Para imágenes prioritarias, cargar inmediatamente
          await Promise.all(promises);
        } else {
          // Para imágenes no prioritarias, cargar en background
          Promise.all(promises).catch(console.error);
        }
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    preloadImages();
  }, [images, priority]);

  return null; // Este componente no renderiza nada
} 