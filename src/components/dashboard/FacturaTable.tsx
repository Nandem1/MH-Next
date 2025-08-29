"use client";

import { Factura } from "@/types/factura";
import { FacturaCard } from "./FacturaCard";
import { FacturaTableDesktop } from "./FacturaTableDesktop";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { useActualizarMontoFactura, useActualizarMetodoPagoFactura, useActualizarFechaPagoFactura, useActualizarCamposBasicosFactura } from "@/hooks/useFacturas";
import dynamic from "next/dynamic";

// Lazy load de modales pesados
const ViewFacturaModal = dynamic(
  () => import("./ViewFacturaModal").then(mod => ({ default: mod.ViewFacturaModal })),
  {
    loading: () => (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false,
  }
);



const EditarMontoModal = dynamic(
  () => import("./EditarMontoModal").then(mod => ({ default: mod.EditarMontoModal })),
  {
    loading: () => (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false,
  }
);

const EditarMetodoPagoModal = dynamic(
  () => import("./EditarMetodoPagoModal").then(mod => ({ default: mod.EditarMetodoPagoModal })),
  {
    loading: () => (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false,
  }
);

const EditarFechaPagoModal = dynamic(
  () => import("./EditarFechaPagoModal").then(mod => ({ default: mod.EditarFechaPagoModal })),
  {
    loading: () => (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false,
  }
);

const EditarCamposBasicosModal = dynamic(
  () => import("./EditarCamposBasicosModal").then(mod => ({ default: mod.EditarCamposBasicosModal })),
  {
    loading: () => (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false,
  }
);

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
  const actualizarMetodoPagoMutation = useActualizarMetodoPagoFactura();
  const actualizarFechaPagoMutation = useActualizarFechaPagoFactura();
  const actualizarCamposBasicosMutation = useActualizarCamposBasicosFactura();

  // Forzar recálculo de layout al montar
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [openEditarMontoModal, setOpenEditarMontoModal] = useState(false);
  const [openEditarMetodoPagoModal, setOpenEditarMetodoPagoModal] = useState(false);
  const [openEditarFechaPagoModal, setOpenEditarFechaPagoModal] = useState(false);
  const [openEditarCamposBasicosModal, setOpenEditarCamposBasicosModal] = useState(false);
  const [facturaParaEditar, setFacturaParaEditar] = useState<Factura | null>(null);
  // Control local solo para UI (modales y snackbar)
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

  const handleOpenEditarMetodoPagoModal = (factura: Factura) => {
    setFacturaParaEditar(factura);
    setOpenEditarMetodoPagoModal(true);
  };

  const handleCloseEditarMetodoPagoModal = () => {
    setFacturaParaEditar(null);
    setOpenEditarMetodoPagoModal(false);
  };

  const handleEditarMetodoPago = async (data: import("@/types/factura").ActualizarMetodoPagoRequest) => {
    if (!facturaParaEditar) return;
    
    try {
      // Cerrar el modal inmediatamente (optimistic update ya actualizó la UI)
      handleCloseEditarMetodoPagoModal();
      
      // Ejecutar la mutación en background (sin await)
      actualizarMetodoPagoMutation.mutate(data);
    } catch (error) {
      console.error("Error al actualizar método de pago:", error);
      // El modal manejará el error automáticamente
      throw error;
    }
  };

  const handleOpenEditarFechaPagoModal = (factura: Factura) => {
    setFacturaParaEditar(factura);
    setOpenEditarFechaPagoModal(true);
  };

  const handleCloseEditarFechaPagoModal = () => {
    setFacturaParaEditar(null);
    setOpenEditarFechaPagoModal(false);
  };

  const handleEditarFechaPago = async (fecha_pago: string) => {
    if (!facturaParaEditar) return;
    
    try {
      // Cerrar el modal inmediatamente (optimistic update ya actualizó la UI)
      handleCloseEditarFechaPagoModal();
      
      // Ejecutar la mutación en background (sin await)
      actualizarFechaPagoMutation.mutate({
        id: facturaParaEditar.id,
        fecha_pago
      });
    } catch (error) {
      console.error("Error al actualizar fecha de pago:", error);
      // El modal manejará el error automáticamente
      throw error;
    }
  };

  const handleOpenEditarCamposBasicosModal = (factura: Factura) => {
    setFacturaParaEditar(factura);
    setOpenEditarCamposBasicosModal(true);
  };

  const handleCloseEditarCamposBasicosModal = () => {
    setFacturaParaEditar(null);
    setOpenEditarCamposBasicosModal(false);
  };

  const handleEditarCamposBasicos = async (data: import("@/types/factura").ActualizarCamposBasicosRequest) => {
    if (!facturaParaEditar) return;
    
    try {
      // Cerrar el modal inmediatamente (optimistic update ya actualizó la UI)
      handleCloseEditarCamposBasicosModal();
      
      // Ejecutar la mutación en background (sin await)
      actualizarCamposBasicosMutation.mutate(data);
    } catch (error) {
      console.error("Error al actualizar campos básicos:", error);
      // El modal manejará el error automáticamente
      throw error;
    }
  };

  // Verificar si se está actualizando alguna factura
  const isUpdating = actualizarMontoMutation.isPending || actualizarMetodoPagoMutation.isPending || actualizarFechaPagoMutation.isPending || actualizarCamposBasicosMutation.isPending;

  // Manejar estados de la mutación: mostrar toast una sola vez y resetear estado interno de la mutación
  useEffect(() => {
    if (actualizarMontoMutation.isSuccess) {
      setSnackbar({
        open: true,
        message: 'Monto actualizado correctamente',
        severity: 'success'
      });
      actualizarMontoMutation.reset();
    }
    if (actualizarMontoMutation.isError) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar monto',
        severity: 'error'
      });
      actualizarMontoMutation.reset();
    }
  }, [actualizarMontoMutation]);

  // Manejar estados de la mutación de método de pago
  useEffect(() => {
    if (actualizarMetodoPagoMutation.isSuccess) {
      setSnackbar({
        open: true,
        message: 'Método de pago actualizado correctamente',
        severity: 'success'
      });
      actualizarMetodoPagoMutation.reset();
    }
    if (actualizarMetodoPagoMutation.isError) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar método de pago',
        severity: 'error'
      });
      actualizarMetodoPagoMutation.reset();
    }
  }, [actualizarMetodoPagoMutation]);

  // Manejar estados de la mutación de fecha de pago
  useEffect(() => {
    if (actualizarFechaPagoMutation.isSuccess) {
      setSnackbar({
        open: true,
        message: 'Fecha de pago actualizada correctamente',
        severity: 'success'
      });
      actualizarFechaPagoMutation.reset();
    }
    if (actualizarFechaPagoMutation.isError) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar fecha de pago',
        severity: 'error'
      });
      actualizarFechaPagoMutation.reset();
    }
  }, [actualizarFechaPagoMutation]);

  // Manejar estados de la mutación de campos básicos
  useEffect(() => {
    if (actualizarCamposBasicosMutation.isSuccess) {
      setSnackbar({
        open: true,
        message: 'Campos básicos actualizados correctamente',
        severity: 'success'
      });
      actualizarCamposBasicosMutation.reset();
    }
    if (actualizarCamposBasicosMutation.isError) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar campos básicos',
        severity: 'error'
      });
      actualizarCamposBasicosMutation.reset();
    }
  }, [actualizarCamposBasicosMutation]);



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
          Factura no encontrada
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
              onEditarMonto={() => handleOpenEditarMontoModal(factura)}
              onEditarPago={() => handleOpenEditarMetodoPagoModal(factura)}
              onEditarFechaPago={() => handleOpenEditarFechaPagoModal(factura)}
              onEditarCamposBasicos={() => handleOpenEditarCamposBasicosModal(factura)}
            />
          ))}
        </Box>
      ) : (
        <FacturaTableDesktop
          facturas={facturas}
          onView={handleOpenViewModal}
          onEditarMonto={handleOpenEditarMontoModal}
          onEditarPago={handleOpenEditarMetodoPagoModal}
          onEditarFechaPago={handleOpenEditarFechaPagoModal}
          onEditarCamposBasicos={handleOpenEditarCamposBasicosModal}
        />
      )}

      <ViewFacturaModal
        open={openViewModal}
        onClose={handleCloseViewModal}
        factura={selectedFactura}
      />



      <EditarMontoModal
        open={openEditarMontoModal}
        onClose={handleCloseEditarMontoModal}
        onSubmit={handleEditarMonto}
        montoActual={facturaParaEditar?.monto}
        titulo={`Factura ${facturaParaEditar?.folio} - ${facturaParaEditar?.proveedor}`}
        loading={isUpdating}
      />

      <EditarMetodoPagoModal
        open={openEditarMetodoPagoModal}
        onClose={handleCloseEditarMetodoPagoModal}
        onSubmit={handleEditarMetodoPago}
        factura={facturaParaEditar}
        loading={actualizarMetodoPagoMutation.isPending}
      />

      <EditarFechaPagoModal
        open={openEditarFechaPagoModal}
        onClose={handleCloseEditarFechaPagoModal}
        onSubmit={handleEditarFechaPago}
        fechaPagoActual={facturaParaEditar?.fecha_pago}
        titulo={`Factura ${facturaParaEditar?.folio} - ${facturaParaEditar?.proveedor}`}
        loading={actualizarFechaPagoMutation.isPending}
      />

      <EditarCamposBasicosModal
        open={openEditarCamposBasicosModal}
        onClose={handleCloseEditarCamposBasicosModal}
        onSubmit={handleEditarCamposBasicos}
        factura={facturaParaEditar}
        loading={actualizarCamposBasicosMutation.isPending}
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
