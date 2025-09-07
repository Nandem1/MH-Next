"use client";

import { useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import { FacturaSearchBar } from "./FacturaSearchBar";
import { FacturaTable } from "./FacturaTable";
import { useFacturas } from "@/hooks/useFacturas";
import { MobileImagePreloader } from "@/components/ui/MobileImagePreloader";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
// Nota: búsqueda por folio se maneja vía React Query (useFacturas)

export function FacturaPageContent() {
  // Hook para forzar un re-render después del primer mount y corregir glitch visual
  const mounted = useResponsive("(min-width:0px)");
  
  // Optimizaciones específicas para mobile
  const { isMobile } = useMobileOptimization();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  // Folio activo para consulta vía React Query
  const [folioActivo, setFolioActivo] = useState<string>("");
  // Correlativo de cheque activo para consulta vía React Query
  const [chequeCorrelativoActivo, setChequeCorrelativoActivo] = useState<string>("");
  const [localActivo, setLocalActivo] = useState<string>("");
  const [usuarioActivo, setUsuarioActivo] = useState<string>("");
  const [proveedorActivo, setProveedorActivo] = useState<string>("");
  const [fechaDesdeActivo, setFechaDesdeActivo] = useState<string>("");
  const [fechaHastaActivo, setFechaHastaActivo] = useState<string>("");
  const [prontasAPagarActivo, setProntasAPagarActivo] = useState<boolean>(false);

  const { data, isLoading, error } = useFacturas(
    page,
    limit,
    localActivo,
    usuarioActivo,
    proveedorActivo,
    folioActivo,
    chequeCorrelativoActivo,
    fechaDesdeActivo,
    fechaHastaActivo,
    prontasAPagarActivo
  );
  const facturas = data?.facturas ?? [];
  const totalFacturas = data?.total ?? 0;

  const handleSearch = async (
    folio: string,
    chequeCorrelativo: string
  ) => {
    setPage(1);
    setFolioActivo(folio.trim());
    setChequeCorrelativoActivo(chequeCorrelativo.trim());
  };

  const handleLocalChange = (nuevoLocal: string) => {
    setFolioActivo("");
    setChequeCorrelativoActivo("");
    setLocalActivo(nuevoLocal);
    setPage(1);
  };

  const handleUsuarioChange = (nuevoUsuario: string) => {
    setFolioActivo("");
    setChequeCorrelativoActivo("");
    setUsuarioActivo(nuevoUsuario);
    setPage(1);
  };

  const handleProveedorChange = (nuevoProveedor: string) => {
    setFolioActivo("");
    setChequeCorrelativoActivo("");
    setProveedorActivo(nuevoProveedor);
    setPage(1);
  };

  const handleFechaDesdeChange = (nuevaFechaDesde: string) => {
    setFolioActivo("");
    setChequeCorrelativoActivo("");
    setFechaDesdeActivo(nuevaFechaDesde);
    setPage(1);
  };

  const handleFechaHastaChange = (nuevaFechaHasta: string) => {
    setFolioActivo("");
    setChequeCorrelativoActivo("");
    setFechaHastaActivo(nuevaFechaHasta);
    setPage(1);
  };

  const handleProntasAPagarChange = (nuevoProntasAPagar: boolean) => {
    setFolioActivo("");
    setChequeCorrelativoActivo("");
    setProntasAPagarActivo(nuevoProntasAPagar);
    setPage(1);
  };

  const handleClearSearch = () => {
    setFolioActivo("");
    setChequeCorrelativoActivo("");
    setLocalActivo("");
    setUsuarioActivo("");
    setProveedorActivo("");
    setFechaDesdeActivo("");
    setFechaHastaActivo("");
    setProntasAPagarActivo(false);
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const facturasParaMostrar = facturas;

  // Extraer URLs de imágenes para preloading
  const imageUrls = facturas.slice(0, 5).map(factura => factura.image_url_cloudinary);

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
              {/* Preload de imágenes críticas optimizado para mobile */}
        <MobileImagePreloader images={imageUrls} maxImages={isMobile ? 2 : 5} />
        <FacturaSearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          onLocalChange={handleLocalChange}
          onUsuarioChange={handleUsuarioChange}
          onProveedorChange={handleProveedorChange}
          onFechaDesdeChange={handleFechaDesdeChange}
          onFechaHastaChange={handleFechaHastaChange}
          onProntasAPagarChange={handleProntasAPagarChange}
          localActual={localActivo}
          usuarioActual={usuarioActivo}
          proveedorActual={proveedorActivo}
          fechaDesdeActual={fechaDesdeActivo}
          fechaHastaActual={fechaHastaActivo}
          prontasAPagarActual={prontasAPagarActivo}
        />

      {isLoading ? (
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
          {!folioActivo && !chequeCorrelativoActivo && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
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
    </Box>
  );
}
