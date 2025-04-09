import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import Image from "next/image";
import { Factura } from "@/types/factura";
import { formatearRut } from "@/utils/formatearRut";

interface ViewFacturaModalProps {
  open: boolean;
  onClose: () => void;
  factura: Factura | null;
}

export function ViewFacturaModal({ open, onClose, factura }: ViewFacturaModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: "0.8rem" }}>
        {factura ? `FA ${factura.folio} - ${factura.proveedor} ${formatearRut(factura.rut_proveedor || '')}` : "Factura"}
      </DialogTitle>
      <DialogContent dividers>
        {factura && (
          <Image
            src={factura.image_url_cloudinary}
            alt={`Factura ${factura.folio}`}
            width={800}
            height={1000}
            style={{ width: "100%", height: "auto", borderRadius: "2px", objectFit: "cover" }}
            unoptimized
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
