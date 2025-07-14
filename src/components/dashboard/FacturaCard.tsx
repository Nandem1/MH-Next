"use client";

import { Typography, Button, Box, Divider, IconButton, CircularProgress, Card, CardContent, Stack, Tooltip, useTheme, Chip } from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Factura } from "@/types/factura";
import { formatearRut } from "@/utils/formatearRut";
import { formatearMonto } from "@/utils/formatearMonto";

interface FacturaCardProps {
  factura: Factura;
  onView: () => void;
  onPrint: () => void;
  onEditarMonto: () => void;
  onEditarPago: () => void;
}

export function FacturaCard({
  factura,
  onView,
  onPrint,
  onEditarMonto,
  onEditarPago,
}: FacturaCardProps) {
  const theme = useTheme();

  const getPagoColor = (metodoPago: string) => {
    switch (metodoPago) {
      case "POR_PAGAR":
        return "warning"; // Naranja vibrante - más llamativo
      case "CHEQUE":
        return "info"; // Azul eléctrico - moderno y confiable
      case "TRANSFERENCIA":
        return "success"; // Verde suave - sutil
      case "EFECTIVO":
        return "default"; // Gris elegante - discreto
      default:
        return "default";
    }
  };

  const getPagoText = (factura: Factura) => {
    if (!factura.metodo_pago || factura.metodo_pago === "POR_PAGAR") {
      return "POR PAGAR";
    }
    
    // Para cheques, siempre mostrar solo "Cheque" - el correlativo se mostrará en un span separado
    if (factura.metodo_pago === "CHEQUE") {
      return "Cheque";
    }
    
    return factura.metodo_pago;
  };

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", height: 200, overflow: "hidden" }}>
        <OptimizedImage
          src={factura.image_url_cloudinary}
          alt={`Factura ${factura.folio}`}
          fill
          variant="card"
          lazy={true}
          quality={60}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: "cover",
            aspectRatio: "4/3", // Aspect ratio fijo para evitar CLS
          }}
        />
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={2}>
          {/* Header */}
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Folio: {factura.folio}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {factura.proveedor}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rut: {formatearRut(factura.rut_proveedor || "")}
            </Typography>
          </Box>

          <Divider />

          {/* Información */}
          <Stack spacing={1}>
            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Local:
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 1 }}>
                {factura.local}
              </Typography>
            </Box>

            {/* PAGADO CON con diseño minimalista */}
            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Pagado con:
              </Typography>
              {factura.isUpdating ? (
                <CircularProgress size={16} sx={{ ml: 1 }} />
              ) : (
                <Box sx={{ ml: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.2 }}>
                  <Chip
                    label={getPagoText(factura)}
                    color={getPagoColor(factura.metodo_pago || "POR_PAGAR")}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                      height: '20px',
                      '& .MuiChip-label': {
                        px: 1,
                        fontWeight: 500,
                      },
                      // Estilos especiales para estados principales
                      ...(factura.metodo_pago === "POR_PAGAR" && {
                        borderColor: '#ff9800',
                        color: '#ff9800',
                        backgroundColor: 'rgba(255, 152, 0, 0.08)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 152, 0, 0.12)',
                        },
                      }),
                      ...(factura.metodo_pago === "CHEQUE" && {
                        borderColor: '#2196f3',
                        color: '#2196f3',
                        backgroundColor: 'rgba(33, 150, 243, 0.08)',
                        '&:hover': {
                          backgroundColor: 'rgba(33, 150, 243, 0.12)',
                        },
                      }),
                    }}
                  />
                  {/* Mostrar correlativo del cheque en un span separado */}
                  {factura.metodo_pago === "CHEQUE" && factura.cheque_correlativo && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      #{factura.cheque_correlativo}
                    </Typography>
                  )}
                </Box>
              )}
              <Tooltip title="Editar método de pago">
                <IconButton
                  size="small"
                  onClick={onEditarPago}
                  disabled={factura.isUpdating}
                  sx={{
                    ml: 1,
                    width: 24,
                    height: 24,
                    color: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: "0.875rem",
                    },
                  }}
                >
                  <PaymentIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Monto con ícono de editar */}
            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Monto:
              </Typography>
              {factura.isUpdating ? (
                <CircularProgress size={16} sx={{ ml: 1 }} />
              ) : (
                <Typography variant="body2" fontWeight={500} sx={{ ml: 1 }}>
                  {formatearMonto(factura.monto)}
                </Typography>
              )}
              <Tooltip title="Editar monto">
                <IconButton
                  size="small"
                  onClick={onEditarMonto}
                  disabled={factura.isUpdating}
                  sx={{
                    ml: 1,
                    width: 24,
                    height: 24,
                    color: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: "0.875rem",
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Fecha:
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 1 }}>
                {new Date(factura.fechaIngreso).toLocaleDateString()}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Subido por:
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 1 }}>
                {factura.nombre_usuario}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          {/* Acciones */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onView}
              sx={{ textTransform: "none" }}
            >
              Ver Factura
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onPrint}
              sx={{ textTransform: "none" }}
            >
              <PrintIcon fontSize="small" />
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
