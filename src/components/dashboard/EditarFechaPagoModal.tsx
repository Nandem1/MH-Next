"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";

interface EditarFechaPagoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (fecha_pago: string) => Promise<void>;
  fechaPagoActual?: string;
  titulo: string;
  loading?: boolean;
}

export function EditarFechaPagoModal({
  open,
  onClose,
  onSubmit,
  fechaPagoActual,
  titulo,
  loading = false,
}: EditarFechaPagoModalProps) {
  const theme = useTheme();
  const [fechaPago, setFechaPago] = useState(fechaPagoActual || "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fechaPago.trim()) {
      setError("La fecha de pago es requerida");
      return;
    }
    
    // Validar formato de fecha YYYY-MM-DD
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaPago)) {
      setError("La fecha debe tener el formato YYYY-MM-DD");
      return;
    }

    // Validar que la fecha sea válida
    const fecha = new Date(fechaPago);
    if (isNaN(fecha.getTime())) {
      setError("La fecha ingresada no es válida");
      return;
    }

    try {
      setError(null);
      await onSubmit(fechaPago);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar fecha de pago");
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFechaPago(fechaPagoActual || "");
      setError(null);
      onClose();
    }
  };

  // Actualizar la fecha cuando cambie la fecha actual
  useEffect(() => {
    if (open) {
      setFechaPago(fechaPagoActual || "");
    }
  }, [open, fechaPagoActual]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          bgcolor: "background.paper",
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: "text.primary" }}>
            Editar Fecha de Pago
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            {titulo}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 0 }}>
          <Box>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: "8px",
                  border: `1px solid ${theme.palette.error.light}`,
                  bgcolor: theme.palette.mode === 'light' ? "#fef2f2" : "#2d1b1b",
                  color: "error.main",
                }}
              >
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Fecha de Pago"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              placeholder="YYYY-MM-DD"
              margin="normal"
              required
              disabled={loading}
              type="date"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  color: theme.palette.text.primary,
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.text.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.secondary,
                  "&.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                },
                input: {
                  color: theme.palette.text.primary,
                },
              }}
              InputProps={{ style: { color: theme.palette.text.primary } }}
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              helperText={<span style={{ color: theme.palette.text.secondary }}>Formato: YYYY-MM-DD</span>}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: theme.palette.text.secondary,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.mode === 'light' ? "#000" : "#000",
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
                boxShadow: "none",
              },
              "&:disabled": {
                bgcolor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "inherit" }} />
            ) : (
              "Guardar Fecha"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
