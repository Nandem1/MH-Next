"use client";

import { useState } from "react";
import { Factura } from "@/types/factura";
import { FacturaSearchBar } from "./FacturaSearchBar";
import { FacturaTable } from "./FacturaTable";
import { useFacturas } from "@/hooks/useFacturas";
import { CircularProgress, Box, Typography } from "@mui/material";
import { adaptFactura } from "@/utils/adaptFactura";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function FacturaPageContent() {
  const { data: facturas, isLoading, isFetching, error } = useFacturas();
  const [facturaFiltrada, setFacturaFiltrada] = useState<Factura[] | null>(null);

  const handleSearch = async (folio: string, local: string) => {
    try {
      if (folio) {
        const response = await fetch(`${API_URL}/api/facturas/${folio}`);
        if (!response.ok) throw new Error("Factura no encontrada");

        const data = await response.json();
        const adaptedData = adaptFactura(data[0], 0);

        let result = adaptedData ? [adaptedData] : [];

        if (local) {
          result = result.filter((factura) => factura.local.includes(local));
        }

        setFacturaFiltrada(result);
      } else if (local) {
        // Si solo hay filtro por local
        const filtradas = facturas?.filter((factura) => factura.local.includes(local)) ?? [];
        setFacturaFiltrada(filtradas);
      } else {
        // Si no hay ningún filtro
        setFacturaFiltrada(null);
      }
    } catch (err) {
      console.error("Error buscando factura:", err);
      setFacturaFiltrada([]);
    }
  };

  const handleClearSearch = () => {
    setFacturaFiltrada(null);
  };

  const facturasParaMostrar = facturaFiltrada ?? facturas;

  return (
    <>
      <FacturaSearchBar onSearch={handleSearch} onClear={handleClearSearch} />

      {isLoading || isFetching ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", p: 4 }}>
          <Typography color="error">Error cargando facturas</Typography>
        </Box>
      ) : (
        <FacturaTable facturas={facturasParaMostrar || []} isLoading={false} error={false} />
      )}
    </>
  );
}
