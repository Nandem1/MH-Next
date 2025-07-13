"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

interface ConfirmChangeEstadoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmChangeEstadoModal({
  open,
  onClose,
  onConfirm,
}: ConfirmChangeEstadoModalProps) {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Confirmar Cambio de Estado
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: 0 }}>
        <Typography variant="body2" color="text.secondary">
          ¿Estás seguro de que deseas cambiar el estado de esta factura?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
