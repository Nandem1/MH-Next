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
} from "@mui/material";
import { CarteleriaAuditResult } from "@/types/carteleria";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface CarteleriaCardProps {
  item: CarteleriaAuditResult;
}

export function CarteleriaCard({ item }: CarteleriaCardProps) {
  const { carteleria, precioDetalleCoincide, precioMayoristaCoincide, diferenciaDetalle, diferenciaMayorista } = item;
  
  const hasDiscrepancia = !precioDetalleCoincide || !precioMayoristaCoincide;

  // Determinar si es un pack/display (cuando codigo y nombre son null o vacíos)
  const isPack = (!carteleria.codigo || carteleria.codigo === "") && 
                 (!carteleria.nombre || carteleria.nombre === "") && 
                 carteleria.codigo_pack;

  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card 
      elevation={hasDiscrepancia ? 3 : 1}
      sx={{ 
        mb: 2,
        border: hasDiscrepancia ? 2 : 1,
        borderColor: hasDiscrepancia ? "error.main" : "divider",
        "&:hover": {
          boxShadow: hasDiscrepancia ? 6 : 3,
        }
      }}
    >
      <CardContent>
        {/* Header con información básica */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <Typography variant="h6" component="h3" gutterBottom>
              {carteleria.nombre || carteleria.nombre_pack || "Sin nombre"}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Código: {(carteleria.codigo && carteleria.codigo !== "") ? carteleria.codigo : (carteleria.codigo_pack || "Sin código")} | 
              Código de Barras: {carteleria.codigo_barras}
            </Typography>
            {/* Debug info temporal */}
            <Typography variant="caption" color="error" gutterBottom>
              Debug: codigo={carteleria.codigo}, nombre={carteleria.nombre}, codigo_pack={carteleria.codigo_pack}, isPack={String(isPack)}
            </Typography>
            {/* Mostrar información del pack si existe */}
            {carteleria.nombre_pack && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Pack: {carteleria.nombre_pack} ({carteleria.cantidad_articulo} unidades)
              </Typography>
            )}
            {/* Mostrar información del artículo unitario si existe */}
            {carteleria.nombre_articulo && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Artículo: {carteleria.nombre_articulo} ({carteleria.codigo_articulo})
              </Typography>
            )}
          </Box>
          <Box display="flex" gap={1} flexDirection="column" alignItems="flex-end">
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
                  <WarningIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                  Precio detalle: {formatPrice(isPack ? carteleria.precio_base : carteleria.carteleria_precio_detalle)} vs {formatPrice(isPack ? carteleria.precio_base : carteleria.lista_precio_detalle)}
                  <Chip 
                    label={`Diferencia: ${formatPrice(Math.abs(diferenciaDetalle))}`} 
                    size="small" 
                    color="error" 
                    sx={{ ml: 1 }}
                  />
                </Typography>
              )}
              {!precioMayoristaCoincide && (
                <Typography variant="body2">
                  <WarningIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                  Precio mayorista: {formatPrice(isPack ? carteleria.precio_base : carteleria.carteleria_precio_mayorista)} vs {formatPrice(isPack ? carteleria.precio_base : carteleria.lista_precio_mayorista)}
                  <Chip 
                    label={`Diferencia: ${formatPrice(Math.abs(diferenciaMayorista))}`} 
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
                <Typography variant="h6" color={precioDetalleCoincide ? "success.main" : "error.main"}>
                  {formatPrice(isPack ? carteleria.precio_base : carteleria.carteleria_precio_detalle)}
                  {precioDetalleCoincide ? (
                    <CheckCircleIcon sx={{ fontSize: 16, ml: 0.5, verticalAlign: "middle" }} />
                  ) : (
                    <WarningIcon sx={{ fontSize: 16, ml: 0.5, verticalAlign: "middle" }} />
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Mayorista
                </Typography>
                <Typography variant="h6" color={precioMayoristaCoincide ? "success.main" : "error.main"}>
                  {formatPrice(isPack ? carteleria.precio_base : carteleria.carteleria_precio_mayorista)}
                  {precioMayoristaCoincide ? (
                    <CheckCircleIcon sx={{ fontSize: 16, ml: 0.5, verticalAlign: "middle" }} />
                  ) : (
                    <WarningIcon sx={{ fontSize: 16, ml: 0.5, verticalAlign: "middle" }} />
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
                  {formatPrice(isPack ? carteleria.precio_base : carteleria.lista_precio_detalle)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Mayorista
                </Typography>
                <Typography variant="h6">
                  {formatPrice(isPack ? carteleria.precio_base : carteleria.lista_precio_mayorista)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="caption" color="text.secondary">
              Última actualización de lista: {formatDate(carteleria.lista_updated_at)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
} 