"use client";

/**
 * Hook personalizado para animaciones
 * Simplifica el uso de Framer Motion siguiendo principios KISS
 */

import { useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { animationPresets, transitions, generateStaggerDelay } from '@/utils/animations';

// ============================================================================
// TIPOS (SOLID - Interface Segregation)
// ============================================================================

type AnimationPreset = keyof typeof animationPresets;

interface UseAnimationOptions {
  preset?: AnimationPreset;
  delay?: number;
  disabled?: boolean;
  triggerOnce?: boolean;
}

interface UseListAnimationOptions {
  staggerDelay?: number;
  disabled?: boolean;
}

interface UseInViewAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

// ============================================================================
// HOOK PRINCIPAL (KISS - Keep It Simple)
// ============================================================================

/**
 * Hook principal para animaciones
 * Proporciona configuraciones preestablecidas y personalizables
 */
export const useAnimations = (options: UseAnimationOptions = {}) => {
  const {
    preset = 'fade',
    delay = 0,
    disabled = false
  } = options;

  // Configuración base del preset seleccionado
  const baseConfig = useMemo(() => {
    if (disabled) {
      return {
        initial: false,
        animate: false,
        transition: undefined
      };
    }

    const config = { ...animationPresets[preset] };
    
    // Aplicar delay si se especifica
    if (delay > 0) {
      const configWithTransition = config as typeof config & { transition?: Record<string, unknown> };
      configWithTransition.transition = {
        ...(configWithTransition.transition || {}),
        delay
      };
    }

    return config;
  }, [preset, delay, disabled]);

  // Transiciones predefinidas para uso directo
  const quickTransitions = useMemo(() => ({
    fast: transitions.fast,
    normal: transitions.normal,
    slow: transitions.slow,
    spring: transitions.spring,
    bounce: transitions.bounce
  }), []);

  return {
    // Configuración principal
    ...baseConfig,
    
    // Transiciones disponibles
    transitions: quickTransitions
  };
};

// ============================================================================
// HOOKS ESPECIALIZADOS (SOLID - Single Responsibility)
// ============================================================================

/**
 * Hook para animaciones de lista con stagger
 * Maneja automáticamente el escalonamiento de elementos
 */
export const useListAnimations = (
  itemCount: number,
  options: UseListAnimationOptions = {}
) => {
  const { staggerDelay = 0.1, disabled = false } = options;

  const containerConfig = useMemo(() => {
    if (disabled) {
      return {
        initial: false,
        animate: false
      };
    }

    return {
      ...animationPresets.list,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    };
  }, [staggerDelay, disabled]);

  const itemConfig = useMemo(() => {
    if (disabled) {
      return {
        initial: false,
        animate: false
      };
    }

    return animationPresets.listItem;
  }, [disabled]);

  // Generar delays individuales para cada elemento
  const itemDelays = useMemo(() => {
    return Array.from({ length: itemCount }, (_, index) => 
      generateStaggerDelay(index, staggerDelay)
    );
  }, [itemCount, staggerDelay]);

  return {
    container: containerConfig,
    item: itemConfig,
    itemDelays
  };
};

/**
 * Hook para animaciones basadas en visibilidad (scroll-triggered)
 * Utiliza Intersection Observer para activar animaciones
 */
export const useInViewAnimations = (options: UseInViewAnimationOptions = {}) => {
  const {
    triggerOnce = true
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  
  const isInView = useInView(ref, {
    once: triggerOnce
  });

  const animationConfig = useMemo(() => ({
    initial: { opacity: 0, y: 50 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
    transition: transitions.normal
  }), [isInView]);

  return {
    ref,
    isInView,
    ...animationConfig
  };
};

/**
 * Hook para animaciones de página
 * Maneja transiciones entre rutas del dashboard
 */
export const usePageAnimations = (disabled: boolean = false) => {
  const config = useMemo(() => {
    if (disabled) {
      return {
        initial: false,
        animate: false
      };
    }

    return {
      ...animationPresets.page,
      // Asegurar que la página se monte correctamente
      layout: true
    };
  }, [disabled]);

  return config;
};

/**
 * Hook para animaciones de modal
 * Proporciona configuraciones para backdrop y contenido del modal
 */
export const useModalAnimations = (isOpen: boolean, disabled: boolean = false) => {
  const backdropConfig = useMemo(() => {
    if (disabled) {
      return {
        initial: false,
        animate: false
      };
    }

    return {
      initial: { opacity: 0 },
      animate: isOpen ? { opacity: 1 } : { opacity: 0 },
      exit: { opacity: 0 },
      transition: transitions.fast
    };
  }, [isOpen, disabled]);

  const modalConfig = useMemo(() => {
    if (disabled) {
      return {
        initial: false,
        animate: false
      };
    }

    return {
      ...animationPresets.modal,
      // Prevenir animaciones cuando el modal no está visible
      animate: isOpen ? 'visible' : 'hidden'
    };
  }, [isOpen, disabled]);

  return {
    backdrop: backdropConfig,
    modal: modalConfig
  };
};

// ============================================================================
// HOOK DE UTILIDADES (DRY - Don't Repeat Yourself)
// ============================================================================

/**
 * Hook para crear configuraciones de animación personalizadas
 * Permite combinar presets con modificaciones específicas
 */
export const useCustomAnimation = (
  basePreset: AnimationPreset,
  overrides: Record<string, unknown> = {}
) => {
  const config = useMemo(() => {
    const base = { ...animationPresets[basePreset] };
    
    // Aplicar overrides de manera segura
    const result = {
      ...base,
      ...overrides
    };
    
    // Combinar variants si ambos existen
    if (base.variants && overrides.variants) {
      result.variants = { ...base.variants, ...overrides.variants };
    }
    
    return result;
  }, [basePreset, overrides]);

  return config;
};
