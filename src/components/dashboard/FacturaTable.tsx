"use client";

import { Factura } from "@/types/factura";
import { FacturaCard } from "./FacturaCard";
import { FacturaTableDesktop } from "./FacturaTableDesktop";
import { ViewFacturaModal } from "./ViewFacturaModal";
import { ConfirmChangeEstadoModal } from "./ConfirmChangeEstadoModal";
import { EditarMontoModal } from "./EditarMontoModal";
import { Box, Skeleton, Typography, Container, Snackbar, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { useActualizarMontoFactura } from "@/hooks/useFacturas";

interface FacturaTableProps {
  facturas: Factura[];
  isLoading: boolean;
  error: boolean;
}

export function FacturaTable({
  facturas,
  isLoading,
  error,
}: FacturaTableProps) {
  const isMobile = useResponsive("(max-width:600px)");
  const actualizarMontoMutation = useActualizarMontoFactura();

  // Forzar recálculo de layout al montar
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openEditarMontoModal, setOpenEditarMontoModal] = useState(false);
  const [facturaParaEditar, setFacturaParaEditar] = useState<Factura | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleOpenViewModal = (factura: Factura) => {
    setSelectedFactura(factura);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setSelectedFactura(null);
    setOpenViewModal(false);
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

  const handleOpenEditarMontoModal = (factura: Factura) => {
    setFacturaParaEditar(factura);
    setOpenEditarMontoModal(true);
  };

  const handleCloseEditarMontoModal = () => {
    setFacturaParaEditar(null);
    setOpenEditarMontoModal(false);
  };

  const handleEditarMonto = async (monto: number) => {
    if (!facturaParaEditar) return;
    
    try {
      // Cerrar el modal inmediatamente (optimistic update ya actualizó la UI)
      handleCloseEditarMontoModal();
      
      // Ejecutar la mutación en background (sin await)
      actualizarMontoMutation.mutate({ 
        id: facturaParaEditar.id, 
        monto 
      });
    } catch (error) {
      console.error("Error al actualizar monto:", error);
      // El modal manejará el error automáticamente
      throw error;
    }
  };

  // Verificar si se está actualizando alguna factura
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

  const handlePrint = (factura: Factura) => {
    if (!factura) return;

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
      <img src="${factura.image_url_cloudinary}" alt="Factura ${factura.folio}" />
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
          Error cargando facturas
        </Typography>
      </Container>
    );
  }

  if (!facturas || facturas.length === 0) {
    return (
      <Container sx={{ py: 4, flexGrow: 1 }}>
        <Typography textAlign="center" color="text.secondary">
          No hay facturas disponibles
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      {isMobile ? (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {facturas.map((factura) => (
            <FacturaCard
              key={factura.id}
              factura={factura}
              onView={() => handleOpenViewModal(factura)}
              onPrint={() => handlePrint(factura)}
              onEditarMonto={() => handleOpenEditarMontoModal(factura)}
            />
          ))}
        </Box>
      ) : (
        <FacturaTableDesktop
          facturas={facturas}
          onView={handleOpenViewModal}
          onChangeEstado={handleOpenConfirmModal}
          onPrint={handlePrint}
          onEditarMonto={handleOpenEditarMontoModal}
        />
      )}

      <ViewFacturaModal
        open={openViewModal}
        onClose={handleCloseViewModal}
        factura={selectedFactura}
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
        montoActual={facturaParaEditar?.monto}
        titulo={`Factura ${facturaParaEditar?.folio} - ${facturaParaEditar?.proveedor}`}
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
