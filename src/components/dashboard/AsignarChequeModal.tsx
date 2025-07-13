"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Alert, CircularProgress, TextField, Paper, Stack, useTheme } from "@mui/material";



import { useState, useEffect, useCallback } from "react";
import { nominaChequeService } from "@/services/nominaChequeService";
import { AsignarChequeRequest } from "@/types/nominaCheque";

interface FacturaEncontrada {
  id: string;
  folio: string;
  proveedor: string;
  monto: number;
}

interface AsignarChequeModalProps {
  open: boolean;
  onClose: () => void;
  onAsignar: (request: AsignarChequeRequest) => Promise<void>;
  numeroCheque: string;
  loading?: boolean;
}

export function AsignarChequeModal({
  open,
  onClose,
  onAsignar,
  numeroCheque,
  loading = false,
}: AsignarChequeModalProps) {
  const [folioBusqueda, setFolioBusqueda] = useState("");
  const [facturaEncontrada, setFacturaEncontrada] = useState<FacturaEncontrada | null>(null);
  const [montoPagado, setMontoPagado] = useState("");
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const theme = useTheme();

  // Función de búsqueda con debounce
  const buscarFactura = useCallback(async (folio: string) => {
    if (!folio.trim()) {
      setFacturaEncontrada(null);
      return;
    }

    try {
      setLoadingBusqueda(true);
      setError(null);
      const factura = await nominaChequeService.buscarFacturaPorFolio(folio.trim());
      setFacturaEncontrada(factura);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar factura");
      setFacturaEncontrada(null);
    } finally {
      setLoadingBusqueda(false);
    }
  }, []);

  // Manejar cambio en el folio con debounce
  const handleFolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFolioBusqueda(value);
    setError(null);

    // Limpiar timeout anterior
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Establecer nuevo timeout para búsqueda
    const timeout = setTimeout(() => {
      buscarFactura(value);
    }, 1000); // 1 segundo de debounce

    setDebounceTimeout(timeout);
  };

  // Limpiar al cerrar modal
  useEffect(() => {
    if (!open) {
      setFolioBusqueda("");
      setFacturaEncontrada(null);
      setMontoPagado("");
      setError(null);
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    }
  }, [open, debounceTimeout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folioBusqueda.trim()) {
      setError("Debes ingresar un folio de factura");
      return;
    }

    if (!facturaEncontrada) {
      setError("Debes buscar y encontrar una factura válida");
      return;
    }

    try {
      setError(null);
      await onAsignar({
        facturaFolio: folioBusqueda.trim(),
        montoPagado: montoPagado ? parseFloat(montoPagado) : undefined,
      });
      
      // Limpiar formulario
      setFolioBusqueda("");
      setFacturaEncontrada(null);
      setMontoPagado("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar cheque");
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFolioBusqueda("");
      setFacturaEncontrada(null);
      setMontoPagado("");
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
            Asignar Cheque a Factura
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
            
            <TextField
              fullWidth
              label="Folio de Factura"
              value={folioBusqueda}
              onChange={handleFolioChange}
              placeholder="Ingresa el folio de la factura..."
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                endAdornment: loadingBusqueda && (
                  <CircularProgress size={20} sx={{ color: "text.secondary" }} />
                ),
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
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              helperText={<span style={{ color: theme.palette.text.secondary }}>La búsqueda se realizará automáticamente 1 segundo después de dejar de escribir</span>}
            />

            {facturaEncontrada && (
              <Paper 
                elevation={0} 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: theme.palette.mode === 'light' ? "#f0f8ff" : "#1a2332",
                  border: `1px solid ${theme.palette.mode === 'light' ? "#b3d9ff" : "#2d3748"}`,
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h6" sx={{ color: "text.primary", mb: 1 }}>
                  Factura Encontrada
                </Typography>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Folio:</Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
                      {facturaEncontrada.folio}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Proveedor:</Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
                      {facturaEncontrada.proveedor}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Monto Factura:</Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
                      ${facturaEncontrada.monto.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}

            <TextField
              fullWidth
              label="Monto a Pagar (Opcional)"
              value={montoPagado}
              onChange={(e) => setMontoPagado(e.target.value)}
              placeholder="Dejar vacío para usar monto de factura"
              margin="normal"
              disabled={loading || !facturaEncontrada}
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
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              helperText={<span style={{ color: theme.palette.text.secondary }}>Si se deja vacío, se usará el monto de la factura</span>}
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
            disabled={loading || !facturaEncontrada}
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
              "Asignar Cheque"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 