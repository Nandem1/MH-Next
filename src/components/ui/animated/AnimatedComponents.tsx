"use client";

/**
 * Componentes animados reutilizables
 * Envuelven Material-UI con Framer Motion
 * Siguiendo principios SOLID y DRY
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { 
  Box, 
  Paper, 
  Card, 
  Button, 
  IconButton,
  Typography,
  BoxProps,
  CardProps
} from '@mui/material';

// ============================================================================
// TIPOS BASE (SOLID - Interface Segregation)
// ============================================================================

type AnimatedBoxProps = BoxProps & HTMLMotionProps<"div">;
type AnimatedCardProps = CardProps & HTMLMotionProps<"div">;

// ============================================================================
// COMPONENTES BASE ANIMADOS (DRY - Don't Repeat Yourself)
// ============================================================================

/**
 * Box animado - Componente base más versátil
 */
export const AnimatedBox = motion(Box);

/**
 * Paper animado - Para containers y cards
 */
export const AnimatedPaper = motion(Paper);

/**
 * Card animado - Para tarjetas y componentes destacados
 */
export const AnimatedCard = motion(Card);

/**
 * Button animado - Para botones con feedback visual
 */
export const AnimatedButton = motion(Button);

/**
 * IconButton animado - Para botones de iconos
 */
export const AnimatedIconButton = motion(IconButton);

/**
 * Typography animado - Para textos con animaciones
 */
export const AnimatedTypography = motion(Typography);

// ============================================================================
// COMPONENTES ESPECIALIZADOS (SOLID - Single Responsibility)
// ============================================================================

/**
 * Container animado para páginas
 * Aplica animaciones consistentes a nivel de página
 */
export const PageContainer = forwardRef<HTMLDivElement, AnimatedBoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <AnimatedBox
        ref={ref}
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 0, md: 3 },
          py: { xs: 3, md: 2 },
          gap: 2,
        }}
        {...props}
      >
        {children}
      </AnimatedBox>
    );
  }
);

PageContainer.displayName = 'PageContainer';

/**
 * Card interactiva con animaciones de hover
 * Para elementos clickeables o destacados
 */
export const InteractiveCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, sx, ...props }, ref) => {
    return (
      <AnimatedCard
        ref={ref}
        sx={{
          cursor: 'pointer',
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: (theme) => theme.shadows[8],
          },
          ...sx,
        }}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </AnimatedCard>
    );
  }
);

InteractiveCard.displayName = 'InteractiveCard';

/**
 * Modal Container animado
 * Para modales y overlays con animaciones suaves
 */
export const ModalContainer = forwardRef<HTMLDivElement, AnimatedBoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <AnimatedBox
        ref={ref}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1300,
        }}
        {...props}
      >
        {children}
      </AnimatedBox>
    );
  }
);

ModalContainer.displayName = 'ModalContainer';

/**
 * List Container animado
 * Para listas con animaciones staggered
 */
export const ListContainer = forwardRef<HTMLDivElement, AnimatedBoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <AnimatedBox
        ref={ref}
        component="ul"
        sx={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
        {...props}
      >
        {children}
      </AnimatedBox>
    );
  }
);

ListContainer.displayName = 'ListContainer';

/**
 * List Item animado
 * Para elementos individuales de lista
 */
export const ListItem = forwardRef<HTMLLIElement, AnimatedBoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <AnimatedBox
        ref={ref}
        component="li"
        {...props}
      >
        {children}
      </AnimatedBox>
    );
  }
);

ListItem.displayName = 'ListItem';

// ============================================================================
// LOADING COMPONENTS (KISS - Keep It Simple)
// ============================================================================

/**
 * Skeleton animado simple
 * Para estados de carga
 */
export const AnimatedSkeleton = forwardRef<HTMLDivElement, AnimatedBoxProps>(
  ({ sx, ...props }, ref) => {
    return (
      <AnimatedBox
        ref={ref}
        sx={{
          backgroundColor: 'grey.200',
          borderRadius: 1,
          ...sx,
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        {...props}
      />
    );
  }
);

AnimatedSkeleton.displayName = 'AnimatedSkeleton';

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================

/**
 * Pulse indicator animado
 * Para indicar actividad o estados importantes
 */
export const PulseIndicator = forwardRef<HTMLDivElement, AnimatedBoxProps>(
  ({ sx, ...props }, ref) => {
    return (
      <AnimatedBox
        ref={ref}
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          ...sx,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        {...props}
      />
    );
  }
);

PulseIndicator.displayName = 'PulseIndicator';
