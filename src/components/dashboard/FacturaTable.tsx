"use client";

import { Factura } from "@/types/factura";
import { FacturaCard } from "./FacturaCard";
import { FacturaTableDesktop } from "./FacturaTableDesktop";
import { ViewFacturaModal } from "./ViewFacturaModal";
import { ConfirmChangeEstadoModal } from "./ConfirmChangeEstadoModal";
import {
  useMediaQuery,
  Box,
  Skeleton,
  Typography,
  Container,
} from "@mui/material";
import { useState } from "react";

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
  const isMobile = useMediaQuery("(max-width:600px)");

  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedFacturaId, setSelectedFacturaId] = useState<string | null>(
    null
  );

  const handleOpenViewModal = (factura: Factura) => {
    setSelectedFactura(factura);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setSelectedFactura(null);
    setOpenViewModal(false);
  };

  const handleOpenConfirmModal = (id: string) => {
    setSelectedFacturaId(id);
    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setSelectedFacturaId(null);
    setOpenConfirmModal(false);
  };

  const handleConfirmChangeEstado = () => {
    console.log(`Cambiar estado de factura ID: ${selectedFacturaId}`);
    handleCloseConfirmModal();
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
            />
          ))}
        </Box>
      ) : (
        <FacturaTableDesktop
          facturas={facturas}
          onView={handleOpenViewModal}
          onChangeEstado={handleOpenConfirmModal}
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
    </Box>
  );
}