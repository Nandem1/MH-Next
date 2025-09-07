/**
 * Exportaciones centralizadas para componentes animados
 * Siguiendo principios DRY y facilitando imports limpios
 */

// Componentes base animados
export {
  AnimatedBox,
  AnimatedPaper,
  AnimatedCard,
  AnimatedButton,
  AnimatedIconButton,
  AnimatedTypography,
  PageContainer,
  InteractiveCard,
  ModalContainer,
  ListContainer,
  ListItem,
  AnimatedSkeleton,
  PulseIndicator
} from './AnimatedComponents';

// Modales animados
export {
  AnimatedModal,
  AnimatedConfirmModal,
  AnimatedLoadingModal
} from './AnimatedModal';

// Transiciones de página
export {
  PageTransition,
  useRouteChange
} from './PageTransition';

// Re-exportar hooks para conveniencia
export {
  useAnimations,
  useListAnimations,
  useInViewAnimations,
  usePageAnimations,
  useModalAnimations,
  useCustomAnimation
} from '@/hooks/useAnimations';

// Re-exportar utilidades de animación
export {
  transitions,
  fadeVariants,
  slideVariants,
  scaleVariants,
  containerVariants,
  listItemVariants,
  pageVariants,
  modalVariants,
  loadingVariants,
  animationPresets,
  generateStaggerDelay,
  combineVariants,
  createTransition
} from '@/utils/animations';
