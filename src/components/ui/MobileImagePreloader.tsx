"use client";

import { useEffect } from 'react';
import { useResponsive } from '@/hooks/useResponsive';

interface MobileImagePreloaderProps {
  images: string[];
  maxImages?: number;
}

export function MobileImagePreloader({ 
  images, 
  maxImages = 3 // Solo preload las primeras 3 en mobile
}: MobileImagePreloaderProps) {
  const isMobile = useResponsive("(max-width: 768px)");

  useEffect(() => {
    if (!images.length) return;

    // En mobile, solo preload las primeras imágenes
    const imagesToPreload = isMobile ? images.slice(0, maxImages) : images;

    const preloadImages = async () => {
      const promises = imagesToPreload.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        // En mobile, cargar en background sin bloquear
        if (isMobile) {
          Promise.all(promises).catch(console.error);
        } else {
          await Promise.all(promises);
        }
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    preloadImages();
  }, [images, isMobile, maxImages]);

  return null;
} 