/**
 * Sistema de animaciones centralizado usando Framer Motion
 * Siguiendo principios KISS, SOLID y DRY
 */

import { Variants, Transition } from 'framer-motion';

// ============================================================================
// TRANSICIONES BASE (DRY - Don't Repeat Yourself)
// ============================================================================

export const transitions = {
  fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } as Transition,
  normal: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } as Transition,
  slow: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } as Transition,
  spring: { type: 'spring', stiffness: 300, damping: 30 } as Transition,
  bounce: { type: 'spring', stiffness: 400, damping: 10 } as Transition,
} as const;

// ============================================================================
// VARIANTS REUTILIZABLES (SOLID - Single Responsibility)
// ============================================================================

/**
 * Fade animations - Para elementos que aparecen/desaparecen
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

/**
 * Slide animations - Para elementos que se deslizan
 */
export const slideVariants = {
  up: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -10, opacity: 0 }
  },
  down: {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 10, opacity: 0 }
  },
  left: {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -10, opacity: 0 }
  },
  right: {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 10, opacity: 0 }
  }
} as const;

/**
 * Scale animations - Para modales, botones, cards
 */
export const scaleVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

/**
 * Container animations - Para listas y grids (stagger children)
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

/**
 * List item animations - Para elementos de lista
 */
export const listItemVariants: Variants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: 10, opacity: 0 }
};

// ============================================================================
// ANIMACIONES ESPECIALIZADAS (SOLID - Open/Closed Principle)
// ============================================================================

/**
 * Page transition variants - Para transiciones entre páginas
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

/**
 * Modal variants - Para modales y overlays
 */
export const modalVariants = {
  backdrop: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  },
  modal: {
    hidden: { scale: 0.8, opacity: 0, y: 50 },
    visible: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.8, opacity: 0, y: 50 }
  }
} as const;

/**
 * Loading variants - Para estados de carga
 */
export const loadingVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// ============================================================================
// CONFIGURACIONES PRESETS (KISS - Keep It Simple)
// ============================================================================

/**
 * Configuraciones comunes para diferentes tipos de componentes
 */
export const animationPresets = {
  // Para páginas del dashboard
  page: {
    variants: slideVariants.up,
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    transition: transitions.normal
  },
  
  // Para modales
  modal: {
    variants: modalVariants.modal,
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    transition: transitions.fast
  },
  
  // Para cards y componentes interactivos
  card: {
    variants: scaleVariants,
    initial: 'hidden',
    animate: 'visible',
    whileHover: 'hover',
    whileTap: 'tap',
    transition: transitions.fast
  },
  
  // Para listas
  list: {
    variants: containerVariants,
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit'
  },
  
  // Para elementos de lista
  listItem: {
    variants: listItemVariants,
    transition: transitions.fast
  },
  
  // Para fade simple
  fade: {
    variants: fadeVariants,
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    transition: transitions.normal
  }
} as const;

// ============================================================================
// HELPERS Y UTILIDADES
// ============================================================================

/**
 * Genera un delay escalonado para animaciones de lista
 */
export const generateStaggerDelay = (index: number, baseDelay: number = 0.1): number => {
  return index * baseDelay;
};

/**
 * Combina múltiples variants de manera segura
 */
export const combineVariants = (...variants: Variants[]): Variants => {
  return variants.reduce((acc, variant) => ({ ...acc, ...variant }), {});
};

/**
 * Crea una transición personalizada basada en los presets
 */
export const createTransition = (
  duration?: number,
  ease?: string | number[],
  delay?: number
): Transition => {
  return {
    duration: duration ?? 0.3,
    ease: ease ?? [0.4, 0, 0.2, 1],
    delay: delay ?? 0
  };
};
