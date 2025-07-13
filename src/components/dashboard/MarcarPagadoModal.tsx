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
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { MarcarPagadoRequest } from "@/types/nominaCheque";
import { useTheme } from "@mui/material";

interface MarcarPagadoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: MarcarPagadoRequest) => Promise<void>;
  numeroCheque: string;
  montoFactura?: number;
  loading?: boolean;
}

export function MarcarPagadoModal({
  open,
  onClose,
  onSubmit,
  numeroCheque,
  montoFactura,
  loading = false,
}: MarcarPagadoModalProps) {
  const theme = useTheme();
  const [montoPagado, setMontoPagado] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!montoPagado.trim()) {
      setError("El monto pagado es requerido");
      return;
    }
    
    if (isNaN(parseFloat(montoPagado)) || parseFloat(montoPagado) <= 0) {
      setError("El monto debe ser un número válido mayor a 0");
      return;
    }

    if (!fechaPago.trim()) {
      setError("La fecha de pago es requerida");
      return;
    }

    try {
      setError(null);
      await onSubmit({
        montoPagado: parseFloat(montoPagado),
        fechaPago: fechaPago,
      });
      
      // Limpiar formulario
      setMontoPagado("");
      setFechaPago("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al marcar como pagado");
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMontoPagado("");
      setFechaPago("");
      setError(null);
      onClose();
    }
  };

  // Establecer monto de factura como valor inicial si está disponible
  useEffect(() => {
    if (open && montoFactura && !montoPagado) {
      setMontoPagado(montoFactura.toString());
    }
  }, [open, montoFactura, montoPagado]);

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
            Marcar Cheque como Pagado
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            Cheque: {numeroCheque}
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
            {montoFactura && (
              <Paper 
                elevation={0} 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  bgcolor: theme.palette.mode === 'light' ? "#fff3cd" : "#2d2b1b",
                  border: `1px solid ${theme.palette.mode === 'light' ? '#ffeaa7' : '#4a4a2b'}`,
                  borderRadius: "8px",
                }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                  💡 Monto de la factura asociada: <strong>${montoFactura.toLocaleString()}</strong>
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Puedes modificar el monto si se pagó una cantidad diferente
                </Typography>
              </Paper>
            )}
            <TextField
              fullWidth
              label="Monto Pagado"
              value={montoPagado}
              onChange={(e) => setMontoPagado(e.target.value)}
              placeholder="Ingresa el monto pagado"
              margin="normal"
              required
              disabled={loading}
              type="number"
              inputProps={{
                min: 0,
                step: 1,
              }}
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
              helperText={<span style={{ color: theme.palette.text.secondary }}>Monto real pagado por el cheque</span>}
            />
            <TextField
              fullWidth
              label="Fecha de Pago"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              type="date"
              margin="normal"
              required
              disabled={loading}
              InputLabelProps={{ 
                shrink: true, 
                style: { color: theme.palette.text.secondary } 
              }}
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
              helperText={<span style={{ color: theme.palette.text.secondary }}>Fecha en que se realizó el pago</span>}
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
              bgcolor: theme.palette.success.main,
              color: theme.palette.mode === 'light' ? "#000" : "#000",
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                bgcolor: theme.palette.success.dark,
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
              "Marcar como Pagado"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}