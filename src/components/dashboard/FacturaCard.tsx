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
} from "@mui/material";
import { Factura } from "@/types/factura";
import { formatearRut } from "@/utils/formatearRut";

interface FacturaCardProps {
  factura: Factura;
  onView: () => void;
}

export function FacturaCard({ factura, onView }: FacturaCardProps) {
  return (
    <Card
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <CardMedia
        component="img"
        image={factura.image_url_cloudinary}
        alt={`Imagen factura folio ${factura.folio} - ${factura.proveedor}`}
        sx={{
          height: "30vh",
          objectFit: "cover",
          backgroundColor: "#1e1e1e",
        }}
      />

      <CardContent sx={{ flexGrow: 1, px: 2, pb: 2 }}>
        <Stack spacing={1} height="100%">
          {/* Proveedor */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>
              {factura.proveedor}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rut: {formatearRut(factura.rut_proveedor || "")}
            </Typography>
          </Box>

          <Divider />

          {/* Folio / Local */}
          <Box>
            <Typography variant="body2">
              <strong>Folio:</strong> {factura.folio}
            </Typography>
            <Typography variant="body2">
              <strong>Local:</strong> {factura.local}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Subido por: {factura.nombre_usuario}
            </Typography>
          </Box>

          <Divider />

          {/* Estado / Fecha */}
          <Box>
            <Typography variant="body2">
              <strong>Estado:</strong> {factura.estado}
            </Typography>
            <Typography variant="body2">
              <strong>Fecha:</strong>{" "}
              {new Date(factura.fechaIngreso).toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ mt: "auto" }}>
            <Button
              onClick={onView}
              size="small"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Ver Factura
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}