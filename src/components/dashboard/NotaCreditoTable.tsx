"use client";

import { NotaCredito } from "@/types/notaCredito";
import { NotaCreditoCard } from "./NotaCreditoCard";
import { NotaCreditoTableDesktop } from "./NotaCreditoTableDesktop";
import { ViewNotaCreditoModal } from "./ViewNotaCreditoModal";
import { ViewFacturaAsociadaModal } from "./ViewFacturaAsociadaModal";
import { ConfirmChangeEstadoModal } from "./ConfirmChangeEstadoModal";
import { Box, Skeleton, Typography, Container } from "@mui/material";
import { useState, useEffect } from "react";
import { useResponsive } from "@/hooks/useResponsive";

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

  // Forzar recálculo de layout al montar
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedNotaCredito, setSelectedNotaCredito] = useState<NotaCredito | null>(null);
  const [openFacturaAsociadaModal, setOpenFacturaAsociadaModal] = useState(false);
  const [selectedFacturaAsociada, setSelectedFacturaAsociada] = useState<NotaCredito['facturaAsociada']>(undefined);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedNotaCreditoId, setSelectedNotaCreditoId] = useState<string | null>(
    null
  );

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

  const handleOpenConfirmModal = (id: string) => {
    setSelectedNotaCreditoId(id);
    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setSelectedNotaCreditoId(null);
    setOpenConfirmModal(false);
  };

  const handleConfirmChangeEstado = () => {
    console.log(`Cambiar estado de nota de crédito ID: ${selectedNotaCreditoId}`);
    handleCloseConfirmModal();
  };

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
      <img src="${notaCredito.image_url_cloudinary}" alt="Nota de Crédito ${notaCredito.folio}" />
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
      <img src="${facturaAsociada.image_url_cloudinary}" alt="Factura Asociada ${facturaAsociada.folio}" />
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
              onViewFacturaAsociada={handleOpenFacturaAsociadaModal}
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
    </Box>
  );
} 