"use client";

import { Factura } from "@/types/factura";
import { FacturaCard } from "./FacturaCard";
import { FacturaTableDesktop } from "./FacturaTableDesktop";
import { ViewFacturaModal } from "./ViewFacturaModal";
import { ConfirmChangeEstadoModal } from "./ConfirmChangeEstadoModal";
import { Box, Typography, Container, Alert, Snackbar, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { useUpdateEstado } from "@/hooks/useUpdateEstado";

interface FacturaTableProps {
  facturas: Factura[];
  isLoading: boolean;
  error: boolean;
  idUsuario: number | null;
}

export function FacturaTable({
  facturas,
  isLoading,
  error,
  idUsuario,
}: FacturaTableProps) {
  const [mounted, setMounted] = useState(false);
  const isMobile = useResponsive("(max-width:600px)");
  const updateEstado = useUpdateEstado(idUsuario);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedFacturaId, setSelectedFacturaId] = useState<string | null>(null);
  const [selectedFacturaEstado, setSelectedFacturaEstado] = useState<"BODEGA" | "SALA" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenViewModal = (factura: Factura) => {
    setSelectedFactura(factura);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setSelectedFactura(null);
    setOpenViewModal(false);
  };

  const handleOpenConfirmModal = (id: string, estado: "BODEGA" | "SALA") => {
    setSelectedFacturaId(id);
    setSelectedFacturaEstado(estado);
    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setSelectedFacturaId(null);
    setSelectedFacturaEstado(null);
    setOpenConfirmModal(false);
  };

  const handleConfirmChangeEstado = async () => {
    if (!selectedFacturaId || !selectedFacturaEstado || !idUsuario) return;

    try {
      setIsUpdating(true);
      const nuevoEstado = selectedFacturaEstado === "BODEGA" ? "SALA" : "BODEGA";
      
      await updateEstado.mutateAsync({
        facturaId: selectedFacturaId,
        nuevoEstado,
      });
      
      handleCloseConfirmModal();
    } catch (err) {
      setErrorMessage("Error al actualizar el estado de la factura: " + err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <CircularProgress />
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
      {mounted && isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {facturas.map((factura) => (
            <FacturaCard
              key={factura.id}
              factura={factura}
              onView={() => handleOpenViewModal(factura)}
            />
          ))}
        </Box>
      ) : (
        <FacturaTableDesktop
          facturas={facturas}
          onView={handleOpenViewModal}
          onChangeEstado={(id, estado) => handleOpenConfirmModal(id, estado)}
          isUpdating={isUpdating}
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
        estadoActual={selectedFacturaEstado || "BODEGA"}
        isUpdating={isUpdating}
      />

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
      >
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
