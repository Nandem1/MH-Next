"use client";

import { useState } from "react";
import { Factura } from "@/types/factura";
import { FacturaSearchBar } from "./FacturaSearchBar";
import { FacturaTable } from "./FacturaTable";
import { useFacturas } from "@/hooks/useFacturas";
import {
  CircularProgress,
  Box,
  Typography,
  Pagination,
} from "@mui/material";
import { adaptFactura } from "@/utils/adaptFactura";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function FacturaPageContent() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [facturaFiltrada, setFacturaFiltrada] = useState<Factura[] | null>(null);
  const [localActivo, setLocalActivo] = useState<string>("");

  const { data, isLoading, isFetching, error } = useFacturas(page, limit, localActivo);
  const facturas = data?.facturas ?? [];
  const totalFacturas = data?.total ?? 0;

  const handleSearch = async (folio: string, local: string) => {
    try {
      setPage(1); // Reiniciar página

      if (folio) {
        const response = await fetch(`${API_URL}/api-beta/facturas/${folio}`);
        if (!response.ok) throw new Error("Factura no encontrada");

        const data = await response.json();
        const rawData = Array.isArray(data) ? data[0] : data;
        const adaptedData = adaptFactura(rawData);

        let result = adaptedData ? [adaptedData] : [];

        if (local) {
          result = result.filter((factura) => factura.local.includes(local));
        }

        setFacturaFiltrada(result);
      } else {
        setFacturaFiltrada(null);
      }
    } catch (err) {
      console.error("Error buscando factura:", err);
      setFacturaFiltrada([]);
    }
  };

  const handleLocalChange = (nuevoLocal: string) => {
    setFacturaFiltrada(null);
    setLocalActivo(nuevoLocal);
    setPage(1);
  };

  const handleClearSearch = () => {
    setFacturaFiltrada(null);
    setLocalActivo("");
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const facturasParaMostrar =
    facturaFiltrada !== null ? facturaFiltrada : facturas;

  return (
    <>
      <FacturaSearchBar
        onSearch={handleSearch}
        onClear={handleClearSearch}
        onLocalChange={handleLocalChange}
        localActual={localActivo}
      />

      {isLoading || isFetching ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", p: 4 }}>
          <Typography color="error">Error cargando facturas</Typography>
        </Box>
      ) : (
        <>
          <FacturaTable
            facturas={facturasParaMostrar}
            isLoading={false}
            error={false}
          />
          {facturaFiltrada === null && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={Math.ceil(totalFacturas / limit)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}
