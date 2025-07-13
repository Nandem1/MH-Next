"use client";

import { Typography, Button, Box, Divider, IconButton, CircularProgress, Card, CardContent, Stack, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material";


import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { NotaCredito } from "@/types/notaCredito";
import { formatearRut } from "@/utils/formatearRut";
import { formatearMonto } from "@/utils/formatearMonto";

interface NotaCreditoCardProps {
  notaCredito: NotaCredito;
  onView: () => void;
  onPrint: () => void;
  onPrintFacturaAsociada: () => void;
  onViewFacturaAsociada: () => void;
  onEditarMonto: () => void;
}

export function NotaCreditoCard({
  notaCredito,
  onView,
  onPrint,
  onPrintFacturaAsociada,
  onViewFacturaAsociada,
  onEditarMonto,
}: NotaCreditoCardProps) {
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
          src={notaCredito.image_url_cloudinary}
          alt={`Nota de crédito ${notaCredito.folio}`}
          fill
          variant="card"
        />
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={2}>
          {/* Header */}
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Folio: {notaCredito.folio}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {notaCredito.proveedor}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rut: {formatearRut(notaCredito.rut_proveedor || "")}
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
                {notaCredito.local}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Estado:
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 1 }}>
                {notaCredito.estado}
              </Typography>
            </Box>

            {/* Monto con ícono de editar */}
            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Monto:
              </Typography>
              {notaCredito.isUpdating ? (
                <CircularProgress size={16} sx={{ ml: 1 }} />
              ) : (
                <Typography variant="body2" fontWeight={500} sx={{ ml: 1 }}>
                  {formatearMonto(notaCredito.monto)}
                </Typography>
              )}
              <Tooltip title="Editar monto">
                <IconButton
                  size="small"
                  onClick={onEditarMonto}
                  disabled={notaCredito.isUpdating}
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
                {new Date(notaCredito.fechaIngreso).toLocaleDateString()}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Subido por:
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ ml: 1 }}>
                {notaCredito.nombre_usuario}
              </Typography>
            </Box>
          </Stack>

          {/* Factura Asociada */}
          {notaCredito.facturaAsociada && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  📄 Factura Asociada
                </Typography>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Folio:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {notaCredito.facturaAsociada.folio}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Proveedor:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {notaCredito.facturaAsociada.proveedor}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Estado:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {notaCredito.facturaAsociada.estado}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Monto:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatearMonto(notaCredito.facturaAsociada.monto)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </>
          )}

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
              Ver Nota de Crédito
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

          {/* Acciones de factura asociada */}
          {notaCredito.facturaAsociada && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={onViewFacturaAsociada}
                sx={{ textTransform: "none" }}
              >
                Ver Factura Asociada
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onPrintFacturaAsociada}
                sx={{ textTransform: "none" }}
              >
                <PrintIcon fontSize="small" />
              </Button>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
} 