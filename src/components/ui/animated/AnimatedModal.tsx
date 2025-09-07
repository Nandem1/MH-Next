"use client";

/**
 * Modal animado reutilizable
 * Implementa animaciones suaves siguiendo principios KISS y DRY
 */

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  DialogProps
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';
import { ModalContainer, AnimatedPaper } from './AnimatedComponents';
import { useModalAnimations } from '@/hooks/useAnimations';

// ============================================================================
// TIPOS (SOLID - Interface Segregation)
// ============================================================================

interface AnimatedModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: DialogProps['maxWidth'];
  fullWidth?: boolean;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  showCloseButton?: boolean;
}

// ============================================================================
// COMPONENTE PRINCIPAL (KISS - Keep It Simple)
// ============================================================================

export function AnimatedModal({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  showCloseButton = true
}: AnimatedModalProps) {
  
  // Configuración de animaciones
  const { backdrop, modal } = useModalAnimations(open);

  // Manejar tecla Escape
  useEffect(() => {
    if (disableEscapeKeyDown) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, disableEscapeKeyDown]);

  // Manejar click en backdrop
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (disableBackdropClick) return;
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // No renderizar si no está abierto
  if (!open) return null;

  const modalContent = (
    <AnimatePresence>
      {open && (
        <ModalContainer
          {...backdrop}
          onClick={handleBackdropClick}
        >
          <AnimatedPaper
            {...modal}
            onClick={(e) => e.stopPropagation()}
            elevation={24}
            sx={{
              position: 'relative',
              margin: 2,
              maxHeight: 'calc(100vh - 64px)',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: (theme) => {
                switch (maxWidth) {
                  case 'xs': return theme.breakpoints.values.xs;
                  case 'sm': return theme.breakpoints.values.sm;
                  case 'md': return theme.breakpoints.values.md;
                  case 'lg': return theme.breakpoints.values.lg;
                  case 'xl': return theme.breakpoints.values.xl;
                  default: return theme.breakpoints.values.sm;
                }
              },
              width: fullWidth ? '100%' : 'auto',
              borderRadius: 2,
            }}
          >
            {/* Header del modal */}
            {(title || showCloseButton) && (
              <DialogTitle 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  pb: 1
                }}
              >
                {title && (
                  <Typography variant="h6" component="h2">
                    {title}
                  </Typography>
                )}
                {showCloseButton && (
                  <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{ 
                      ml: 'auto',
                      color: 'grey.500',
                      '&:hover': {
                        color: 'grey.700',
                        backgroundColor: 'grey.100'
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </DialogTitle>
            )}

            {/* Contenido del modal */}
            <DialogContent 
              sx={{ 
                flex: 1,
                overflowY: 'auto',
                px: 3,
                py: title ? 1 : 3
              }}
            >
              {children}
            </DialogContent>

            {/* Acciones del modal */}
            {actions && (
              <DialogActions sx={{ px: 3, pb: 3 }}>
                {actions}
              </DialogActions>
            )}
          </AnimatedPaper>
        </ModalContainer>
      )}
    </AnimatePresence>
  );

  // Renderizar en portal para evitar z-index issues
  return createPortal(modalContent, document.body);
}

// ============================================================================
// VARIANTES ESPECIALIZADAS (DRY - Don't Repeat Yourself)
// ============================================================================

/**
 * Modal de confirmación animado
 * Para acciones que requieren confirmación del usuario
 */
interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'info' | 'warning' | 'error';
}

export function AnimatedConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  severity = 'info'
}: ConfirmModalProps) {
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'primary';
    }
  };

  return (
    <AnimatedModal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="xs"
      actions={
        <>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: '#666',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: getSeverityColor() === 'error' ? '#d32f2f' : '#1976d2',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginLeft: '8px'
            }}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <Typography variant="body1" sx={{ py: 1 }}>
        {message}
      </Typography>
    </AnimatedModal>
  );
}

/**
 * Modal de loading animado
 * Para mostrar estados de carga con mensaje
 */
interface LoadingModalProps {
  open: boolean;
  message?: string;
}

export function AnimatedLoadingModal({ 
  open, 
  message = 'Cargando...' 
}: LoadingModalProps) {
  return (
    <AnimatedModal
      open={open}
      onClose={() => {}} // No se puede cerrar manualmente
      maxWidth="xs"
      disableBackdropClick
      disableEscapeKeyDown
      showCloseButton={false}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e0e0e0',
          borderTop: '3px solid #1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AnimatedModal>
  );
}
