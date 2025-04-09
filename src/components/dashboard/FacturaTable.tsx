"use client";

import { useState } from "react";
import { useMediaQuery, CircularProgress } from "@mui/material";
import { useFacturas } from "@/hooks/useFacturas";
import { Factura } from "@/types/factura";
import { FacturaCard } from "./FacturaCard";
import { FacturaTableDesktop } from "./FacturaTableDesktop";
import { ViewFacturaModal } from "./ViewFacturaModal";
import { ConfirmChangeEstadoModal } from "./ConfirmChangeEstadoModal";

export function FacturaTable() {
  const { data: facturas, isLoading, error } = useFacturas();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedFacturaId, setSelectedFacturaId] = useState<string | null>(null);

  // Abrir modal de ver factura
  const handleOpenViewModal = (factura: Factura) => {
    setSelectedFactura(factura);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setSelectedFactura(null);
    setOpenViewModal(false);
  };

  // Abrir modal de confirmación de cambio de estado
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
      <div className="flex justify-center p-4">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error cargando facturas</div>
    );
  }

  if (!facturas || facturas.length === 0) {
    return (
      <div className="text-center text-gray-500">No hay facturas disponibles</div>
    );
  }

  return (
    <>
      {isMobile ? (
        <div className="p-4 space-y-4">
          {facturas.map((factura) => (
            <FacturaCard
              key={factura.id}
              factura={factura}
              onView={() => handleOpenViewModal(factura)}
            />
          ))}
        </div>
      ) : (
        <FacturaTableDesktop
          facturas={facturas}
          onView={handleOpenViewModal}
          onChangeEstado={handleOpenConfirmModal}
        />
      )}

      {/* Modal Ver Factura */}
      <ViewFacturaModal
        open={openViewModal}
        onClose={handleCloseViewModal}
        factura={selectedFactura}
      />

      {/* Modal Confirmar Cambio Estado */}
      <ConfirmChangeEstadoModal
        open={openConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmChangeEstado}
      />
    </>
  );
}
