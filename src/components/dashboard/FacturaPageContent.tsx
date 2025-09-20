"use client";

import { useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import { FacturaSearchBar } from "./FacturaSearchBar";
import { FacturaTable } from "./FacturaTable";
import { useFacturas, useDeleteFactura } from "@/hooks/useFacturas";
import { MobileImagePreloader } from "@/components/ui/MobileImagePreloader";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import { AnimatedBox, ListContainer } from "@/components/ui/animated/AnimatedComponents";
import { useAnimations, useListAnimations } from "@/hooks/useAnimations";
import { Factura } from "@/types/factura";
import { DeleteFacturaModal } from "./DeleteFacturaModal";
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

  // Estados para el modal de eliminación
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [facturaToDelete, setFacturaToDelete] = useState<Factura | null>(null);

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

  // Hook para eliminar factura
  const deleteFacturaMutation = useDeleteFactura();
  const facturas = data?.facturas ?? [];
  const totalFacturas = data?.total ?? 0;

  // Configuración de animaciones
  const pageAnimation = useAnimations({ preset: 'page', delay: 0.1 });
  const listAnimation = useListAnimations(facturas.length, { staggerDelay: 0.05 });

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

  // Funciones para manejar la eliminación de facturas
  const handleDeleteFactura = (factura: Factura) => {
    setFacturaToDelete(factura);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setFacturaToDelete(null);
  };

  const handleConfirmDelete = async (factura: Factura) => {
    await deleteFacturaMutation.mutateAsync(factura.id);
  };

  const facturasParaMostrar = facturas;

  // Extraer URLs de imágenes para preloading
  const imageUrls = facturas.slice(0, 5).map(factura => factura.image_url_cloudinary);

  return (
    <AnimatedBox
      {...pageAnimation}
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
        <AnimatedBox 
          {...pageAnimation}
          sx={{ display: "flex", justifyContent: "center", p: 4 }}
        >
          <CircularProgress />
        </AnimatedBox>
      ) : error ? (
        <AnimatedBox 
          {...pageAnimation}
          sx={{ textAlign: "center", p: 4 }}
        >
          <Typography color="error">
            {error.message || "Error cargando facturas"}
          </Typography>
        </AnimatedBox>
      ) : (
        <ListContainer {...listAnimation.container}>
          <FacturaTable
            facturas={facturasParaMostrar}
            isLoading={false}
            error={false}
            onDelete={handleDeleteFactura}
          />
          {!folioActivo && !chequeCorrelativoActivo && (
            <AnimatedBox 
              {...pageAnimation}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Pagination
                count={Math.ceil(totalFacturas / limit)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </AnimatedBox>
          )}
        </ListContainer>
      )}

      {/* Modal de confirmación para eliminar factura */}
      <DeleteFacturaModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        factura={facturaToDelete}
        loading={deleteFacturaMutation.isPending}
      />
    </AnimatedBox>
  );
}
