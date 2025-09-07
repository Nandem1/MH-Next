"use client";

import { useState, useEffect, useRef } from 'react';
import { useAnimations, useListAnimations } from './useAnimations';

/**
 * Hook para controlar animaciones basadas en visibilidad
 * Solo anima la primera vez que el componente se hace visible
 */
export function useVisibilityAnimation(options: {
  preset?: 'fade' | 'card' | 'page' | 'modal' | 'list' | 'listItem';
  delay?: number;
  staggerDelay?: number;
  itemCount?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  const {
    preset = 'fade',
    delay = 0,
    staggerDelay = 0.1,
    itemCount = 1
  } = options;

  // Solo animar la primera vez
  useEffect(() => {
    if (!hasAnimated.current) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        hasAnimated.current = true;
      }, 100); // Pequeño delay para asegurar que el componente esté montado

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, []);

  // Para elementos individuales
  const animation = useAnimations({
    preset,
    delay,
    disabled: !isVisible
  });

  // Para listas
  const listAnimation = useListAnimations(itemCount, {
    staggerDelay,
    disabled: !isVisible
  });

  return {
    isVisible,
    animation,
    listAnimation,
    // Función para forzar re-animación si es necesario
    triggerAnimation: () => {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 50);
    }
  };
}

/**
 * Hook específico para métricas con animación simple y sin problemas de layout
 */
export function useMetricsAnimation(serversReady: boolean = false, serversLoading: boolean = false) {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    // Secuencia simple: Dashboard → System Metrics (invisible) → Métricas
    const timers: NodeJS.Timeout[] = [];
    
    // Paso 1: Dashboard title aparece inmediatamente
    if (step < 1) {
      timers.push(setTimeout(() => setStep(1), 200));
    }
    
    // Paso 2: System Metrics aparece (pero invisible inicialmente) 
    if (step < 2) {
      timers.push(setTimeout(() => setStep(2), 400));
    }
    
    // Paso 3: Métricas aparecen SOLO cuando están listas
    if (step < 3 && serversReady && !serversLoading) {
      timers.push(setTimeout(() => setStep(3), 300));
    }

    return () => timers.forEach(clearTimeout);
  }, [serversReady, serversLoading, step]);

  return {
    // Secuencia corregida
    dashboardTitleVisible: step >= 1,
    systemMetricsVisible: step >= 2,
    metricsContainerVisible: step >= 3,
  };
}
