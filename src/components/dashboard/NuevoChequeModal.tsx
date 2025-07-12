"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { CrearChequeRequest } from "@/types/nominaCheque";

interface NuevoChequeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: CrearChequeRequest) => Promise<void>;
  loading?: boolean;
  nominasDisponibles?: { id: string; nombre: string }[];
}

export function NuevoChequeModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  nominasDisponibles = [],
}: NuevoChequeModalProps) {
  const theme = useTheme();
  const [numeroCorrelativo, setNumeroCorrelativo] = useState("");
  const [nominaId, setNominaId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!numeroCorrelativo.trim()) {
      setError("El número de correlativo es requerido");
      return;
    }
    
    if (isNaN(parseInt(numeroCorrelativo))) {
      setError("El correlativo debe ser un número válido");
      return;
    }

    try {
      setError(null);
      await onSubmit({
        numeroCorrelativo: numeroCorrelativo.trim(),
        nominaId: nominaId || undefined,
      });
      
      // Limpiar formulario
      setNumeroCorrelativo("");
      setNominaId("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear cheque");
    }
  };

  const handleClose = () => {
    if (!loading) {
      setNumeroCorrelativo("");
      setNominaId("");
      setError(null);
      onClose();
    }
  };

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
            Nuevo Cheque
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
              label="Número de Correlativo"
              value={numeroCorrelativo}
              onChange={(e) => setNumeroCorrelativo(e.target.value)}
              placeholder="Ej: 100001"
              margin="normal"
              required
              disabled={loading}
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
              helperText={<span style={{ color: theme.palette.text.secondary }}>Número de correlativo del cheque</span>}
              inputProps={{
                pattern: "[0-9]*",
                inputMode: "numeric",
              }}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: theme.palette.text.secondary, "&.Mui-focused": { color: theme.palette.primary.main } }}>
                Asignar a Nómina (Opcional)
              </InputLabel>
              <Select
                value={nominaId}
                label="Asignar a Nómina (Opcional)"
                onChange={(e) => setNominaId(e.target.value)}
                disabled={loading}
                sx={{
                  borderRadius: "8px",
                  color: theme.palette.text.primary,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.text.primary,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                    },
                  },
                }}
              >
                <MenuItem value="" style={{ color: theme.palette.text.primary }}>
                  Sin asignar
                </MenuItem>
                {nominasDisponibles.map((nomina) => (
                  <MenuItem key={nomina.id} value={nomina.id} style={{ color: theme.palette.text.primary }}>
                    {nomina.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              "Crear Cheque"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 