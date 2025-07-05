"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { CarteleriaAuditResult } from "@/types/carteleria";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { CarteleriaPreview } from "./CarteleriaPreview";
import { VencimientosSection } from "./VencimientosSection";

interface CarteleriaCardProps {
  item: CarteleriaAuditResult;
}

export function CarteleriaCard({ item }: CarteleriaCardProps) {
  const [openPreview, setOpenPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const {
    carteleria,
    precioDetalleCoincide,
    precioMayoristaCoincide,
    diferenciaDetalle,
    diferenciaMayorista,
  } = item;

  const hasDiscrepancia = !precioDetalleCoincide || !precioMayoristaCoincide;

  const handleOpenPreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const handleDownloadPNG = async () => {
    if (previewRef.current) {
      try {
        const canvas = await html2canvas(previewRef.current, {
          background: "white",
        });
        
        const link = document.createElement("a");
        link.download = `carteleria-${carteleria.carteleria_id}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error("Error al generar la imagen:", error);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fallbacks dinámicos
  const nombreMostrar =
    carteleria.nombre_producto ||
    carteleria.nombre_pack ||
    carteleria.nombre_articulo ||
    carteleria.nombre ||
    "Sin nombre";

  const codigoMostrar =
    carteleria.codigo_producto ||
    carteleria.codigo_pack ||
    carteleria.codigo_articulo ||
    carteleria.codigo ||
    "N/A";

  return (
    <Card
      elevation={hasDiscrepancia ? 3 : 1}
      sx={{
        mb: 2,
        border: hasDiscrepancia ? 2 : 1,
        borderColor: hasDiscrepancia ? "error.main" : "divider",
        "&:hover": {
          boxShadow: hasDiscrepancia ? 6 : 3,
        },
      }}
    >
      <CardContent>
        {/* Header con información básica */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box flex={1}>
            <Typography variant="h6" component="h3" gutterBottom>
              {nombreMostrar}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Código: {codigoMostrar} | Código de Barras:{" "}
              {carteleria.codigo_barras}
            </Typography>
          </Box>
          <Box
            display="flex"
            gap={1}
            flexDirection="column"
            alignItems="flex-end"
          >
            <Chip
              label={carteleria.tipo_carteleria}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`ID: ${carteleria.carteleria_id}`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Alertas de discrepancias */}
        {hasDiscrepancia && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Discrepancia Detectada</AlertTitle>
            <Box display="flex" flexDirection="column" gap={1}>
              {!precioDetalleCoincide && (
                <Typography variant="body2">
                  <WarningIcon
                    sx={{
                      fontSize: 16,
                      mr: 0.5,
                      verticalAlign: "middle",
                    }}
                  />
                  Precio detalle:{" "}
                  {formatPrice(carteleria.carteleria_precio_detalle ?? 0)} vs{" "}
                  {formatPrice(carteleria.lista_precio_detalle ?? 0)}
                  <Chip
                    label={`Diferencia: ${formatPrice(
                      Math.abs(diferenciaDetalle ?? 0)
                    )}`}
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              )}
              {!precioMayoristaCoincide && (
                <Typography variant="body2">
                  <WarningIcon
                    sx={{
                      fontSize: 16,
                      mr: 0.5,
                      verticalAlign: "middle",
                    }}
                  />
                  Precio mayorista:{" "}
                  {formatPrice(carteleria.carteleria_precio_mayorista ?? 0)} vs{" "}
                  {formatPrice(carteleria.lista_precio_mayorista ?? 0)}
                  <Chip
                    label={`Diferencia: ${formatPrice(
                      Math.abs(diferenciaMayorista ?? 0)
                    )}`}
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              )}
            </Box>
          </Alert>
        )}

        {/* Información de precios */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Precios de Cartelería
            </Typography>
            <Box display="flex" gap={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Detalle
                </Typography>
                <Typography
                  variant="h6"
                  color={precioDetalleCoincide ? "success.main" : "error.main"}
                >
                  {formatPrice(carteleria.carteleria_precio_detalle ?? 0)}
                  {precioDetalleCoincide ? (
                    <CheckCircleIcon
                      sx={{
                        fontSize: 16,
                        ml: 0.5,
                        verticalAlign: "middle",
                      }}
                    />
                  ) : (
                    <WarningIcon
                      sx={{
                        fontSize: 16,
                        ml: 0.5,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Mayorista
                </Typography>
                <Typography
                  variant="h6"
                  color={
                    precioMayoristaCoincide ? "success.main" : "error.main"
                  }
                >
                  {formatPrice(carteleria.carteleria_precio_mayorista ?? 0)}
                  {precioMayoristaCoincide ? (
                    <CheckCircleIcon
                      sx={{
                        fontSize: 16,
                        ml: 0.5,
                        verticalAlign: "middle",
                      }}
                    />
                  ) : (
                    <WarningIcon
                      sx={{
                        fontSize: 16,
                        ml: 0.5,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Precios de Lista
            </Typography>
            <Box display="flex" gap={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Detalle
                </Typography>
                <Typography variant="h6">
                  {formatPrice(carteleria.lista_precio_detalle ?? 0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Mayorista
                </Typography>
                <Typography variant="h6">
                  {formatPrice(carteleria.lista_precio_mayorista ?? 0)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Sección de Vencimientos */}
          <VencimientosSection fechas_vencimiento={carteleria.fechas_vencimiento} />

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Última actualización de lista:{" "}
              {carteleria.lista_updated_at
                ? formatDate(carteleria.lista_updated_at)
                : "Sin fecha"}
            </Typography>
            <IconButton
              size="small"
              onClick={handleOpenPreview}
              sx={{
                color: "text.secondary",
                padding: "4px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      {/* Diálogo de previsualización */}
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Box ref={previewRef}>
            <CarteleriaPreview item={item} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownloadPNG} variant="contained">
            Descargar PNG
          </Button>
          <Button onClick={handleClosePreview}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
