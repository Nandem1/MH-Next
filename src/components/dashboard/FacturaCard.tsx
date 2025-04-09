import { Card, CardContent, CardMedia, Typography, Button, Box, Stack } from "@mui/material";
import { Factura } from "@/types/factura";
import { formatearRut } from "@/utils/formatearRut";
import styles from "./FacturaCard.module.css"; // Usaremos también un CSS Custom

interface FacturaCardProps {
  factura: Factura;
  onView: () => void;
}

export function FacturaCard({ factura, onView }: FacturaCardProps) {
  return (
    <Card
      className={styles.facturaCard}
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 3,
        boxShadow: 4,
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={factura.image_url_cloudinary}
        alt={`Factura ${factura.folio}`}
        sx={{
          objectFit: "contain",
        }}
      />

      <CardContent sx={{ p: 2 }}>
        {/* Stack para orden vertical y espaciado */}
        <Stack spacing={1}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>
              {factura.proveedor}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Rut: {formatearRut(factura.rut_proveedor || "")}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2">
              <strong>Folio:</strong> {factura.folio}
            </Typography>
            <Typography variant="body2">
              <strong>Local:</strong> {factura.local}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Subido por: {factura.nombre_usuario}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2">
              <strong>Estado:</strong> {factura.estado}
            </Typography>
            <Typography variant="body2">
              <strong>Fecha:</strong> {new Date(factura.fechaIngreso).toLocaleDateString()}
            </Typography>
          </Box>
        </Stack>

        <Button
          onClick={onView}
          size="small"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2, borderRadius: 2 }}
          className={styles.facturaButton}
        >
          Ver Factura
        </Button>
      </CardContent>
    </Card>
  );
}
