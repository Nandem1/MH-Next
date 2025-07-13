"use client";

import { Box, Typography, Chip, IconButton, Grid, Alert, Button, CircularProgress, Snackbar, Tooltip, Card, CardContent } from "@mui/material";


import { useState } from "react";

import {
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { ControlVencimiento } from "@/types/vencimientos";
import { ActualizarEstadoVencimientoModal } from "./ActualizarEstadoVencimientoModal";
import { HistorialEstadosVencimiento } from "./HistorialEstadosVencimiento";
import { useSnackbar } from "@/hooks/useSnackbar";

interface ControlVencimientosTableProps {
  data: ControlVencimiento[];
  onRefresh: () => void;
  isRefetching?: boolean;
}

export function ControlVencimientosTable({
  data,
  onRefresh,
  isRefetching,
}: ControlVencimientosTableProps) {
  const { open: snackbarOpen, message, severity, showSnackbar, handleClose: handleSnackbarClose } = useSnackbar();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);
  const [selectedVencimiento, setSelectedVencimiento] = useState<ControlVencimiento | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVencimientoForHistorial, setSelectedVencimientoForHistorial] = useState<ControlVencimiento | null>(null);
  const [historialModalOpen, setHistorialModalOpen] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleOpenModal = (vencimiento: ControlVencimiento) => {
    setSelectedVencimiento(vencimiento);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVencimiento(null);
  };

  const handleOpenHistorialModal = (vencimiento: ControlVencimiento) => {
    setSelectedVencimientoForHistorial(vencimiento);
    setHistorialModalOpen(true);
  };

  const handleCloseHistorialModal = () => {
    setHistorialModalOpen(false);
    setSelectedVencimientoForHistorial(null);
  };

  const handleSuccess = (message: string) => {
    showSnackbar(message, "success");
  };

  const handleError = (message: string) => {
    showSnackbar(message, "error");
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a.fecha_vencimiento;
    const bValue = b.fecha_vencimiento;

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    return new Date(aValue).getTime() - new Date(bValue).getTime(); // Ordenar por fecha ascendente (más próximos primero)
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getDaysUntilExpiry = (fechaVencimiento: string) => {
    const today = new Date();
    const expiryDate = new Date(fechaVencimiento);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (fechaVencimiento: string) => {
    const daysUntilExpiry = getDaysUntilExpiry(fechaVencimiento);
    
    if (daysUntilExpiry < 0) {
      return { status: "vencido", color: "error", days: Math.abs(daysUntilExpiry), severity: "error" as const };
    } else if (daysUntilExpiry <= 7) {
      return { status: "crítico", color: "warning", days: daysUntilExpiry, severity: "warning" as const };
    } else if (daysUntilExpiry <= 30) {
      return { status: "próximo", color: "info", days: daysUntilExpiry, severity: "info" as const };
    } else {
      return { status: "normal", color: "success", days: daysUntilExpiry, severity: "success" as const };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };



  if (data.length === 0) {
    return (
      <Alert severity="info">
        No se encontraron productos con vencimientos próximos.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2">
          Productos con Vencimiento ({data.length})
        </Typography>
        <Tooltip title="Actualizar datos">
          <IconButton onClick={onRefresh} color="primary" size="small" disabled={isRefetching}>
            {isRefetching ? <CircularProgress size={20} /> : <RefreshIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={2}>
        {paginatedData.map((row) => {
          const expiryStatus = getExpiryStatus(row.fecha_vencimiento);
          const nombreProducto = row.nombre_producto || 
                               row.nombre_pack || 
                               row.nombre_articulo || 
                               row.descripcion_producto ||
                               "Sin nombre";
          const precio = row.lista_precio_detalle || 
                       (row.precio_producto ? Number(row.precio_producto) : null) || 
                       row.precio_base;
          
          const isCritical = expiryStatus.status === "vencido" || expiryStatus.status === "crítico";
          
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={row.id}>
              <Card
                elevation={isCritical ? 2 : 1}
                sx={{
                  height: "100%",
                  position: "relative",
                  border: isCritical ? 1.5 : 1,
                  borderColor: row.estado_actual_id === 'rebajado' 
                    ? 'warning.main' 
                    : row.estado_actual_id === 'vendido'
                    ? 'info.main'
                    : isCritical 
                    ? 'error.main' 
                    : "divider",
                  "&:hover": {
                    boxShadow: isCritical ? 4 : 2,
                  },
                }}
              >
                <CardContent sx={{ p: 1.5 }}>
                  {/* Header compacto */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1}
                  >
                    <Box flex={1} minWidth={0}>
                      <Typography 
                        variant="subtitle2" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          lineHeight: 1.2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical"
                        }}
                      >
                        {nombreProducto}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {row.codigo_producto || "N/A"}
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" alignItems="flex-end" ml={1}>
                      <Chip
                        label={`${expiryStatus.days}d`}
                        color={expiryStatus.color as "error" | "warning" | "info" | "success"}
                        size="small"
                        sx={{ fontSize: "0.7rem", height: "20px" }}
                        icon={
                          expiryStatus.status === "vencido" || expiryStatus.status === "crítico" 
                            ? <WarningIcon sx={{ fontSize: "0.8rem" }} /> 
                            : <CheckCircleIcon sx={{ fontSize: "0.8rem" }} />
                        }
                      />
                    </Box>
                  </Box>

                  {/* Alerta compacta para estados críticos */}
                  {isCritical && (
                    <Alert 
                      severity={expiryStatus.severity} 
                      sx={{ 
                        mb: 1, 
                        py: 0.5,
                        "& .MuiAlert-message": { py: 0.5 }
                      }}
                    >
                      <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                        {expiryStatus.status === "vencido" ? "Vencido" : "Crítico"}
                      </Typography>
                    </Alert>
                  )}

                  {/* Información compacta */}
                  <Box display="flex" flexDirection="column" gap={1}>
                    {/* Fecha de vencimiento */}
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <CalendarIcon sx={{ fontSize: "0.8rem" }} color="action" />
                      <Typography variant="caption" color={expiryStatus.color} fontWeight={600}>
                        {formatDate(row.fecha_vencimiento)}
                      </Typography>
                    </Box>

                    {/* Stock y precio en línea */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Stock
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {row.cantidad} {row.unidad_producto || "un"}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="caption" color="text.secondary">
                          Precio
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          {precio ? formatCurrency(precio) : "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Lote si existe */}
                    {row.lote && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Lote: {row.lote}
                        </Typography>
                      </Box>
                    )}

                    {/* Información adicional compacta */}
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      <Chip
                        label={row.origen}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: "0.6rem", height: "18px" }}
                      />
                    </Box>

                    {/* Footer compacto */}
                    <Box sx={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      mt: 0.5
                    }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                        {formatDate(row.updated_at)}
                      </Typography>
                      <Box display="flex" gap={0.5}>
                        <Tooltip title="Actualizar estado">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenModal(row)}
                            sx={{
                              color: "primary.main",
                              padding: "2px",
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.04)",
                              },
                            }}
                          >
                            <EditIcon sx={{ fontSize: "0.8rem" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Ver historial">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenHistorialModal(row)}
                            sx={{
                              color: "text.secondary",
                              padding: "2px",
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                          >
                            <VisibilityIcon sx={{ fontSize: "0.8rem" }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Paginación simple */}
      {data.length > rowsPerPage && (
        <Box display="flex" justifyContent="center" mt={2} gap={1}>
          <Button
            variant="outlined"
            size="small"
            disabled={page === 0}
            onClick={() => handleChangePage(null, page - 1)}
          >
            Anterior
          </Button>
          <Typography variant="body2" sx={{ display: "flex", alignItems: "center", px: 2 }}>
            Página {page + 1} de {Math.ceil(data.length / rowsPerPage)}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            disabled={page >= Math.ceil(data.length / rowsPerPage) - 1}
            onClick={() => handleChangePage(null, page + 1)}
          >
            Siguiente
          </Button>
        </Box>
      )}

      {/* Modal de actualización de estado */}
      {selectedVencimiento && (
        <ActualizarEstadoVencimientoModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          onError={handleError}
          vencimiento={{
            id: selectedVencimiento.id,
            nombre_producto: selectedVencimiento.nombre_producto || 
                             selectedVencimiento.nombre_pack || 
                             selectedVencimiento.nombre_articulo || 
                             selectedVencimiento.descripcion_producto,
            codigo_barras: selectedVencimiento.codigo_barras,
            cantidad: selectedVencimiento.cantidad,
            precio_actual: selectedVencimiento.lista_precio_detalle || 
                          (selectedVencimiento.precio_producto ? Number(selectedVencimiento.precio_producto) : undefined) || 
                          (selectedVencimiento.precio_base || undefined),
          }}
        />
      )}

      {/* Modal de historial de estados */}
      {selectedVencimientoForHistorial && (
        <HistorialEstadosVencimiento
          open={historialModalOpen}
          onClose={handleCloseHistorialModal}
          vencimientoId={selectedVencimientoForHistorial.id}
          nombreProducto={selectedVencimientoForHistorial.nombre_producto || 
                          selectedVencimientoForHistorial.nombre_pack || 
                          selectedVencimientoForHistorial.nombre_articulo || 
                          selectedVencimientoForHistorial.descripcion_producto}
        />
      )}

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 