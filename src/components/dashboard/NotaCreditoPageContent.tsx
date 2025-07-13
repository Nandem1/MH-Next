"use client";

import { useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { NotaCredito } from "@/types/notaCredito";
import { NotaCreditoSearchBar } from "./NotaCreditoSearchBar";
import { NotaCreditoTable } from "./NotaCreditoTable";
import { useNotasCredito } from "@/hooks/useNotasCredito";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import { adaptNotaCredito } from "@/utils/adaptNotaCredito";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function NotaCreditoPageContent() {
  // Hook para forzar un re-render después del primer mount y corregir glitch visual
  const mounted = useResponsive("(min-width:0px)");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [notaCreditoFiltrada, setNotaCreditoFiltrada] = useState<NotaCredito[] | null>(
    null
  );
  const [localActivo, setLocalActivo] = useState<string>("");
  const [usuarioActivo, setUsuarioActivo] = useState<string>("");
  const [proveedorActivo, setProveedorActivo] = useState<string>("");

  const { data, isLoading, isFetching, error } = useNotasCredito(
    page,
    limit,
    localActivo,
    usuarioActivo,
    proveedorActivo
  );
  const notasCredito = data?.notasCredito ?? [];
  const totalNotasCredito = data?.total ?? 0;

  const handleSearch = async (folio: string, local: string) => {
    try {
      setPage(1);

      if (folio) {
        const response = await fetch(`${API_URL}/api-beta/notas_credito/${folio}`);
        if (!response.ok) throw new Error("Nota de crédito no encontrada");

        const data = await response.json();
        const rawData = Array.isArray(data) ? data[0] : data;
        const adaptedData = adaptNotaCredito(rawData);

        let result = adaptedData ? [adaptedData] : [];

        if (local) {
          result = result.filter((notaCredito) => notaCredito.local.includes(local));
        }

        setNotaCreditoFiltrada(result);
      } else {
        setNotaCreditoFiltrada(null);
      }
    } catch (err) {
      console.error("Error buscando nota de crédito:", err);
      setNotaCreditoFiltrada([]);
    }
  };

  const handleLocalChange = (nuevoLocal: string) => {
    setNotaCreditoFiltrada(null);
    setLocalActivo(nuevoLocal);
    setPage(1);
  };

  const handleUsuarioChange = (nuevoUsuario: string) => {
    setNotaCreditoFiltrada(null);
    setUsuarioActivo(nuevoUsuario);
    setPage(1);
  };

  const handleProveedorChange = (nuevoProveedor: string) => {
    setNotaCreditoFiltrada(null);
    setProveedorActivo(nuevoProveedor);
    setPage(1);
  };

  const handleClearSearch = () => {
    setNotaCreditoFiltrada(null);
    setLocalActivo("");
    setUsuarioActivo("");
    setProveedorActivo("");
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const notasCreditoParaMostrar =
    notaCreditoFiltrada !== null ? notaCreditoFiltrada : notasCredito;

  return (
    <Box
      key={mounted ? "mounted" : "init"} // Fuerza remount tras mount inicial
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
        gap: 2,
      }}
    >
      <NotaCreditoSearchBar
        onSearch={handleSearch}
        onClear={handleClearSearch}
        onLocalChange={handleLocalChange}
        onUsuarioChange={handleUsuarioChange}
        onProveedorChange={handleProveedorChange}
        localActual={localActivo}
        usuarioActual={usuarioActivo}
        proveedorActual={proveedorActivo}
      />

      {isLoading || isFetching ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", p: 4 }}>
          <Typography color="error">Error cargando notas de crédito</Typography>
        </Box>
      ) : (
        <>
          <NotaCreditoTable
            notasCredito={notasCreditoParaMostrar}
            isLoading={false}
            error={false}
          />
          {notaCreditoFiltrada === null && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(totalNotasCredito / limit)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
} 