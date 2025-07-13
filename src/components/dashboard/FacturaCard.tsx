"use client";

import { Typography, Button, Box, Divider, IconButton, CircularProgress, Card, CardContent, Stack, Tooltip, useTheme } from "@mui/material";



import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Factura } from "@/types/factura";
import { formatearRut } from "@/utils/formatearRut";
import { formatearMonto } from "@/utils/formatearMonto";

interface FacturaCardProps {
  factura: Factura;
  onView: () => void;
  onPrint: () => void;
  onEditarMonto: () => void;
}

export function FacturaCard({
  factura,
  onView,
  onPrint,
  onEditarMonto,
}: FacturaCardProps) {
  const theme = useTheme();

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

            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Estado:
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 1 }}>
                {factura.estado}
              </Typography>
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
