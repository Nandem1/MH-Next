"use client";

import { NotaCredito } from "@/types/notaCredito";
import { NotaCreditoCard } from "./NotaCreditoCard";
import { NotaCreditoTableDesktop } from "./NotaCreditoTableDesktop";
import { ViewNotaCreditoModal } from "./ViewNotaCreditoModal";
import { ViewFacturaAsociadaModal } from "./ViewFacturaAsociadaModal";
import { ConfirmChangeEstadoModal } from "./ConfirmChangeEstadoModal";
import { EditarMontoModal } from "./EditarMontoModal";
import { Box, Skeleton, Typography, Container, Snackbar, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { useActualizarMontoNotaCredito } from "@/hooks/useNotasCredito";

interface NotaCreditoTableProps {
  notasCredito: NotaCredito[];
  isLoading: boolean;
  error: boolean;
}

export function NotaCreditoTable({
  notasCredito,
  isLoading,
  error,
}: NotaCreditoTableProps) {
  const isMobile = useResponsive("(max-width:600px)");
  const actualizarMontoMutation = useActualizarMontoNotaCredito();

  // Forzar recálculo de layout al montar
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedNotaCredito, setSelectedNotaCredito] = useState<NotaCredito | null>(null);
  const [openFacturaAsociadaModal, setOpenFacturaAsociadaModal] = useState(false);
  const [selectedFacturaAsociada, setSelectedFacturaAsociada] = useState<NotaCredito['facturaAsociada']>(undefined);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openEditarMontoModal, setOpenEditarMontoModal] = useState(false);
  const [notaCreditoParaEditar, setNotaCreditoParaEditar] = useState<NotaCredito | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleOpenViewModal = (notaCredito: NotaCredito) => {
    setSelectedNotaCredito(notaCredito);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setSelectedNotaCredito(null);
    setOpenViewModal(false);
  };

  const handleOpenFacturaAsociadaModal = (facturaAsociada: NotaCredito['facturaAsociada']) => {
    setSelectedFacturaAsociada(facturaAsociada);
    setOpenFacturaAsociadaModal(true);
  };

  const handleCloseFacturaAsociadaModal = () => {
    setSelectedFacturaAsociada(undefined);
    setOpenFacturaAsociadaModal(false);
  };

  const handleOpenConfirmModal = () => {
    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
  };

  const handleConfirmChangeEstado = () => {
    // TODO: Implementar cambio de estado
    handleCloseConfirmModal();
  };

  const handleOpenEditarMontoModal = (notaCredito: NotaCredito) => {
    setNotaCreditoParaEditar(notaCredito);
    setOpenEditarMontoModal(true);
  };

  const handleCloseEditarMontoModal = () => {
    setNotaCreditoParaEditar(null);
    setOpenEditarMontoModal(false);
  };

  const handleEditarMonto = async (monto: number) => {
    if (!notaCreditoParaEditar) return;
    
    try {
      // Cerrar el modal inmediatamente (optimistic update ya actualizó la UI)
      handleCloseEditarMontoModal();
      
      // Ejecutar la mutación en background (sin await)
      actualizarMontoMutation.mutate({ 
        id: notaCreditoParaEditar.id, 
        monto 
      });
    } catch (error) {
      console.error("Error al actualizar monto:", error);
      // El modal manejará el error automáticamente
      throw error;
    }
  };

  // Verificar si se está actualizando alguna nota de crédito
  const isUpdating = actualizarMontoMutation.isPending;

  // Manejar estados de la mutación
  useEffect(() => {
    if (actualizarMontoMutation.isSuccess) {
      setSnackbar({
        open: true,
        message: 'Monto actualizado correctamente',
        severity: 'success'
      });
    }
    if (actualizarMontoMutation.isError) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar monto',
        severity: 'error'
      });
    }
  }, [actualizarMontoMutation.isSuccess, actualizarMontoMutation.isError]);

  const handlePrint = (notaCredito: NotaCredito) => {
    if (!notaCredito) return;

    // Crear un elemento temporal para la impresión
    const printElement = document.createElement('div');
    printElement.id = 'print-element';
    printElement.innerHTML = `
      <style>
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-element, #print-element * {
            visibility: visible !important;
          }
          #print-element {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 95% !important;
            height: 95% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 9999 !important;
          }
          #print-element img {
            width: 95% !important;
            height: 95% !important;
            max-width: 95% !important;
            max-height: 95% !important;
            object-fit: contain !important;
          }
          @page {
            size: A4 portrait !important;
            margin: 0 !important;
          }
        }
      </style>
      <img src="${notaCredito.image_url_cloudinary}" alt="Nota de crédito ${notaCredito.folio}" />
    `;

    // Remover elemento anterior si existe
    const existingElement = document.getElementById('print-element');
    if (existingElement) {
      document.body.removeChild(existingElement);
    }

    // Agregar temporalmente al DOM
    document.body.appendChild(printElement);
    
    // Esperar un momento para que el CSS se aplique
    setTimeout(() => {
      window.print();
      
      // Limpiar después de un breve delay
      setTimeout(() => {
        const elementToRemove = document.getElementById('print-element');
        if (elementToRemove) {
          document.body.removeChild(elementToRemove);
        }
      }, 100);
    }, 100);
  };

  const handlePrintFacturaAsociada = (facturaAsociada: NotaCredito['facturaAsociada']) => {
    if (!facturaAsociada) return;

    // Crear un elemento temporal para la impresión
    const printElement = document.createElement('div');
    printElement.id = 'print-element';
    printElement.innerHTML = `
      <style>
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-element, #print-element * {
            visibility: visible !important;
          }
          #print-element {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 95% !important;
            height: 95% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 9999 !important;
          }
          #print-element img {
            width: 95% !important;
            height: 95% !important;
            max-width: 95% !important;
            max-height: 95% !important;
            object-fit: contain !important;
          }
          @page {
            size: A4 portrait !important;
            margin: 0 !important;
          }
        }
      </style>
      <img src="${facturaAsociada.image_url_cloudinary}" alt="Factura ${facturaAsociada.folio}" />
    `;

    // Remover elemento anterior si existe
    const existingElement = document.getElementById('print-element');
    if (existingElement) {
      document.body.removeChild(existingElement);
    }

    // Agregar temporalmente al DOM
    document.body.appendChild(printElement);
    
    // Esperar un momento para que el CSS se aplique
    setTimeout(() => {
      window.print();
      
      // Limpiar después de un breve delay
      setTimeout(() => {
        const elementToRemove = document.getElementById('print-element');
        if (elementToRemove) {
          document.body.removeChild(elementToRemove);
        }
      }, 100);
    }, 100);
  };

  if (isLoading) {
    return (
      <Box sx={{ px: 3, py: 4, flexGrow: 1 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={40} sx={{ mb: 2 }} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, flexGrow: 1 }}>
        <Typography color="error" textAlign="center">
          Error cargando notas de crédito
        </Typography>
      </Container>
    );
  }

  if (!notasCredito || notasCredito.length === 0) {
    return (
      <Container sx={{ py: 4, flexGrow: 1 }}>
        <Typography textAlign="center" color="text.secondary">
          No hay notas de crédito disponibles
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      {isMobile ? (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {notasCredito.map((notaCredito) => (
            <NotaCreditoCard
              key={notaCredito.id}
              notaCredito={notaCredito}
              onView={() => handleOpenViewModal(notaCredito)}
              onPrint={() => handlePrint(notaCredito)}
              onPrintFacturaAsociada={() => handlePrintFacturaAsociada(notaCredito.facturaAsociada)}
              onViewFacturaAsociada={() => handleOpenFacturaAsociadaModal(notaCredito.facturaAsociada)}
              onEditarMonto={() => handleOpenEditarMontoModal(notaCredito)}
            />
          ))}
        </Box>
      ) : (
        <NotaCreditoTableDesktop
          notasCredito={notasCredito}
          onView={handleOpenViewModal}
          onChangeEstado={handleOpenConfirmModal}
          onViewFacturaAsociada={handleOpenFacturaAsociadaModal}
          onPrint={handlePrint}
          onPrintFacturaAsociada={handlePrintFacturaAsociada}
          onEditarMonto={handleOpenEditarMontoModal}
        />
      )}

      <ViewNotaCreditoModal
        open={openViewModal}
        onClose={handleCloseViewModal}
        notaCredito={selectedNotaCredito}
      />

      <ViewFacturaAsociadaModal
        open={openFacturaAsociadaModal}
        onClose={handleCloseFacturaAsociadaModal}
        facturaAsociada={selectedFacturaAsociada || null}
      />

      <ConfirmChangeEstadoModal
        open={openConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmChangeEstado}
      />

      <EditarMontoModal
        open={openEditarMontoModal}
        onClose={handleCloseEditarMontoModal}
        onSubmit={handleEditarMonto}
        montoActual={notaCreditoParaEditar?.monto}
        titulo={`Nota de Crédito ${notaCreditoParaEditar?.folio} - ${notaCreditoParaEditar?.proveedor}`}
        loading={isUpdating}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 