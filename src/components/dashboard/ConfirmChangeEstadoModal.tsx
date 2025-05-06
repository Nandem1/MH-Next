"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
  Box,
  CircularProgress,
} from "@mui/material";

interface ConfirmChangeEstadoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  estadoActual: "BODEGA" | "SALA";
  isUpdating: boolean;
}

export function ConfirmChangeEstadoModal({
  open,
  onClose,
  onConfirm,
  estadoActual,
  isUpdating,
}: ConfirmChangeEstadoModalProps) {
  const theme = useTheme();
  const nuevoEstado = estadoActual === "BODEGA" ? "SALA" : "BODEGA";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          bgcolor: theme.palette.background.paper,
        }}
      >
        Confirmar Cambio de Estado
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: 0 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            ¿Estás seguro de que deseas cambiar el estado de esta factura?
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body2">
            <strong>Estado actual:</strong> {estadoActual}
          </Typography>
          <Typography variant="body2">
            <strong>Nuevo estado:</strong> {nuevoEstado}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Button onClick={onClose} variant="outlined" color="secondary" disabled={isUpdating}>
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="primary"
          disabled={isUpdating}
          startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
