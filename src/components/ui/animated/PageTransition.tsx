"use client";

/**
 * Componente para transiciones entre páginas
 * Maneja fade in/out automático sin over-engineering
 */

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatedBox } from './AnimatedComponents';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    // Si la ruta cambió, hacer fade out y luego fade in
    if (pathname !== currentPath) {
      setIsVisible(false);
      
      const timer = setTimeout(() => {
        setCurrentPath(pathname);
        setIsVisible(true);
      }, 150); // Duración del fade out
      
      return () => clearTimeout(timer);
    } else {
      // Primera carga o misma ruta
      setIsVisible(true);
    }
  }, [pathname, currentPath]);

  return (
    <AnimatedBox
      className={className}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 10
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
      sx={{ width: '100%', height: '100%' }}
    >
      {children}
    </AnimatedBox>
  );
}

/**
 * Hook para detectar cambios de ruta
 */
export function useRouteChange() {
  const pathname = usePathname();
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setIsChanging(true);
    const timer = setTimeout(() => setIsChanging(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return { isChanging, pathname };
}
