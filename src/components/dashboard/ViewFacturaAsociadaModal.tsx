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
import PrintIcon from "@mui/icons-material/Print";
import Image from "next/image";

interface FacturaAsociada {
  folio: string;
  proveedor: string;
  estado: string;
  fechaIngreso: string;
  image_url_cloudinary: string;
}

interface ViewFacturaAsociadaModalProps {
  open: boolean;
  onClose: () => void;
  facturaAsociada: FacturaAsociada | null;
}

export function ViewFacturaAsociadaModal({
  open,
  onClose,
  facturaAsociada,
}: ViewFacturaAsociadaModalProps) {
  const theme = useTheme();

  const handlePrint = () => {
    if (!facturaAsociada) return;

    // Crear un elemento temporal para la impresión
    const printElement = document.createElement('div');
    printElement.id = 'print-element';
    printElement.innerHTML = `
      <style>
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-element, #print-element * {
            visibility: visible !important;
          }
          #print-element {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 95% !important;
            height: 95% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 9999 !important;
          }
          #print-element img {
            width: 95% !important;
            height: 95% !important;
            max-width: 95% !important;
            max-height: 95% !important;
            object-fit: contain !important;
          }
          @page {
            size: A4 portrait !important;
            margin: 0 !important;
          }
        }
      </style>
      <img src="${facturaAsociada.image_url_cloudinary}" alt="Factura Asociada ${facturaAsociada.folio}" />
    `;

    // Remover elemento anterior si existe
    const existingElement = document.getElementById('print-element');
    if (existingElement) {
      document.body.removeChild(existingElement);
    }

    // Agregar temporalmente al DOM
    document.body.appendChild(printElement);
    
    // Esperar un momento para que el CSS se aplique
    setTimeout(() => {
      window.print();
      
      // Limpiar después de un breve delay
      setTimeout(() => {
        const elementToRemove = document.getElementById('print-element');
        if (elementToRemove) {
          document.body.removeChild(elementToRemove);
        }
      }, 100);
    }, 100);
  };

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
          {facturaAsociada
            ? `📄 Factura Asociada F-${facturaAsociada.folio} · ${facturaAsociada.proveedor}`
            : "Factura Asociada"}
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
        {facturaAsociada && (
          <Image
            src={facturaAsociada.image_url_cloudinary}
            alt={`Imagen de factura asociada ${facturaAsociada.folio} de ${facturaAsociada.proveedor}`}
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
        <Button
          onClick={handlePrint}
          color="primary"
          variant="contained"
          startIcon={<PrintIcon />}
          disabled={!facturaAsociada}
        >
          Imprimir
        </Button>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
} 