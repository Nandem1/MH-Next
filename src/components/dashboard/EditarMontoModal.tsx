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

interface EditarMontoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (monto: number) => Promise<void>;
  montoActual?: number;
  titulo: string;
  loading?: boolean;
}

export function EditarMontoModal({
  open,
  onClose,
  onSubmit,
  montoActual = 0,
  titulo,
  loading = false,
}: EditarMontoModalProps) {
  const theme = useTheme();
  const [monto, setMonto] = useState(montoActual.toString());
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!monto.trim()) {
      setError("El monto es requerido");
      return;
    }
    
    const montoNumero = parseFloat(monto);
    if (isNaN(montoNumero) || montoNumero < 0) {
      setError("El monto debe ser un número válido mayor o igual a 0");
      return;
    }

    try {
      setError(null);
      await onSubmit(montoNumero);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar monto");
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMonto(montoActual.toString());
      setError(null);
      onClose();
    }
  };

  // Actualizar el monto cuando cambie el monto actual
  useEffect(() => {
    if (open) {
      setMonto(montoActual.toString());
    }
  }, [open, montoActual]);

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
            Editar Monto
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
              label="Monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ingresa el monto"
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
              helperText={<span style={{ color: theme.palette.text.secondary }}>Monto en pesos chilenos</span>}
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
              "Guardar Monto"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 