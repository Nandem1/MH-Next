"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Stack,
  Divider,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PrintIcon from "@mui/icons-material/Print";
import { NotaCredito } from "@/types/notaCredito";
import { formatearRut } from "@/utils/formatearRut";
import { useState } from "react";

interface NotaCreditoCardProps {
  notaCredito: NotaCredito;
  onView: () => void;
  onPrint: () => void;
  onPrintFacturaAsociada?: () => void;
  onViewFacturaAsociada?: (facturaAsociada: NotaCredito['facturaAsociada']) => void;
}

export function NotaCreditoCard({ notaCredito, onView, onPrint, onPrintFacturaAsociada, onViewFacturaAsociada }: NotaCreditoCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <CardMedia
        component="img"
        image={notaCredito.image_url_cloudinary}
        alt={`Imagen nota de crédito folio ${notaCredito.folio} - ${notaCredito.proveedor}`}
        onLoad={() => window.dispatchEvent(new Event("resize"))}
        sx={{
          height: { xs: 180, sm: 200, md: 220 },
          objectFit: "cover",
          objectPosition: "top",
          backgroundColor: "#1e1e1e",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />

      <CardContent sx={{ flexGrow: 1, px: { xs: 2, sm: 3 }, pb: 2 }}>
        <Stack spacing={1} height="100%">
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                wordBreak: "break-word",
                hyphens: "auto",
                lineHeight: 1.25,
                maxHeight: { xs: 48, sm: 56 },
                overflow: "hidden",
              }}
            >
              {notaCredito.proveedor}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rut: {formatearRut(notaCredito.rut_proveedor || "")}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="body2">
              <strong>Folio:</strong> {notaCredito.folio}
            </Typography>
            <Typography variant="body2">
              <strong>Local:</strong> {notaCredito.local}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Subido por: {notaCredito.nombre_usuario}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="body2">
              <strong>Estado:</strong> {notaCredito.estado}
            </Typography>
            <Typography variant="body2">
              <strong>Fecha:</strong>{" "}
              {new Date(notaCredito.fechaIngreso).toLocaleDateString()}
            </Typography>
          </Box>

          {/* Botón de expandir si hay factura asociada */}
          {notaCredito.facturaAsociada && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="body2" color="primary" fontWeight={500}>
                📄 Tiene factura asociada
              </Typography>
              <IconButton
                onClick={handleExpandClick}
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
          )}

          {/* Contenido expandible con factura asociada */}
          {notaCredito.facturaAsociada && (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  📄 Factura Asociada
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Folio:</strong> {notaCredito.facturaAsociada.folio}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Proveedor:</strong> {notaCredito.facturaAsociada.proveedor}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Estado:</strong> {notaCredito.facturaAsociada.estado}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fecha:</strong>{" "}
                    {new Date(notaCredito.facturaAsociada.fechaIngreso).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => {
                      if (onViewFacturaAsociada) {
                        onViewFacturaAsociada(notaCredito.facturaAsociada);
                      }
                    }}
                    sx={{ mt: 1 }}
                  >
                    Ver Factura
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<PrintIcon />}
                    onClick={() => {
                      if (onPrintFacturaAsociada) {
                        onPrintFacturaAsociada();
                      }
                    }}
                    sx={{ mt: 1 }}
                  >
                    Imprimir Factura
                  </Button>
                </Stack>
              </Box>
            </Collapse>
          )}

          <Box sx={{ mt: "auto" }}>
            <Stack direction="row" spacing={1}>
              <Button
                onClick={onView}
                size="small"
                variant="contained"
                color="primary"
                sx={{ flex: 1, borderRadius: 2 }}
              >
                Ver Nota de Crédito
              </Button>
              <Button
                onClick={onPrint}
                size="small"
                variant="contained"
                color="primary"
                startIcon={<PrintIcon />}
                sx={{ borderRadius: 2 }}
              >
                Imprimir
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
} 