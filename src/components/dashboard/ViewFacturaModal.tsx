"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { Factura } from "@/types/factura";
import { formatearRut } from "@/utils/formatearRut";

interface ViewFacturaModalProps {
  open: boolean;
  onClose: () => void;
  factura: Factura | null;
}

export function ViewFacturaModal({
  open,
  onClose,
  factura,
}: ViewFacturaModalProps) {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: theme.palette.background.paper,
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          {factura
            ? `FA ${factura.folio} · ${factura.proveedor} · ${formatearRut(
                factura.rut_proveedor || ""
              )}`
            : "Factura"}
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          backgroundColor: theme.palette.background.default,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
        }}
      >
        {factura && (
          <Image
            src={factura.image_url_cloudinary}
            alt={`Imagen de factura ${factura.folio} de ${factura.proveedor}`}
            width={800}
            height={1000}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: theme.shape.borderRadius,
              objectFit: "contain",
              backgroundColor: "#111",
            }}
            unoptimized
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
