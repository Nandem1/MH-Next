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
        width: "100%",
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <CardMedia
        component="img"
        image={factura.image_url_cloudinary}
        alt={`Imagen factura folio ${factura.folio} - ${factura.proveedor}`}
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
                wordBreak: "break-word", // fuerza salto dentro de palabras muy largas
                hyphens: "auto", // añade guiones automáticos si el idioma lo permite
                lineHeight: 1.25, // ajusta altura de línea para textos de 2‑3 líneas
                maxHeight: { xs: 48, sm: 56 }, // límite visual (2–3 líneas aprox.)
                overflow: "hidden",
              }}
            >
              {factura.proveedor}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rut: {formatearRut(factura.rut_proveedor || "")}
            </Typography>
          </Box>

          <Divider />

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
