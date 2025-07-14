"use client";

import { useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import { Factura } from "@/types/factura";
import { FacturaSearchBar } from "./FacturaSearchBar";
import { FacturaTable } from "./FacturaTable";
import { useFacturas } from "@/hooks/useFacturas";
import { MobileImagePreloader } from "@/components/ui/MobileImagePreloader";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import { adaptFactura } from "@/utils/adaptFactura";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function FacturaPageContent() {
  // Hook para forzar un re-render después del primer mount y corregir glitch visual
  const mounted = useResponsive("(min-width:0px)");
  
  // Optimizaciones específicas para mobile
  const { isMobile } = useMobileOptimization();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [facturaFiltrada, setFacturaFiltrada] = useState<Factura[] | null>(
    null
  );
  const [localActivo, setLocalActivo] = useState<string>("");
  const [usuarioActivo, setUsuarioActivo] = useState<string>("");
  const [proveedorActivo, setProveedorActivo] = useState<string>("");

  const { data, isLoading, isFetching, error } = useFacturas(
    page,
    limit,
    localActivo,
    usuarioActivo,
    proveedorActivo
  );
  const facturas = data?.facturas ?? [];
  const totalFacturas = data?.total ?? 0;

  const handleSearch = async (folio: string, local: string, usuario: string, proveedor: string) => {
    try {
      setPage(1);

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
    // Nota: usuario y proveedor se manejan automáticamente a través de los filtros del hook useFacturas
    // Los parámetros se incluyen para mantener compatibilidad con la interfaz del componente
    console.log("Filtros activos:", { local, usuario, proveedor });
  };

  const handleLocalChange = (nuevoLocal: string) => {
    setFacturaFiltrada(null);
    setLocalActivo(nuevoLocal);
    setPage(1);
  };

  const handleUsuarioChange = (nuevoUsuario: string) => {
    setFacturaFiltrada(null);
    setUsuarioActivo(nuevoUsuario);
    setPage(1);
  };

  const handleProveedorChange = (nuevoProveedor: string) => {
    setFacturaFiltrada(null);
    setProveedorActivo(nuevoProveedor);
    setPage(1);
  };

  const handleClearSearch = () => {
    setFacturaFiltrada(null);
    setLocalActivo("");
    setUsuarioActivo("");
    setProveedorActivo("");
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const facturasParaMostrar =
    facturaFiltrada !== null ? facturaFiltrada : facturas;

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
