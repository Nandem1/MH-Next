"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Autocomplete,
  CircularProgress,
  useTheme,
  Stack,
} from "@mui/material";
import { AsignarChequeRequest } from "@/types/nominaCheque";
import { Cheque } from "@/types/factura";
import { useChequesDisponibles } from "@/hooks/useCheques";

interface AsignarChequeModalProps {
  open: boolean;
  onClose: () => void;
  onAsignar: (request: AsignarChequeRequest) => void;
}

export function AsignarChequeModal({
  open,
  onClose,
  onAsignar,
}: AsignarChequeModalProps) {
  const theme = useTheme();
  const [chequeSeleccionado, setChequeSeleccionado] = useState<Cheque | null>(null);
  const [error, setError] = useState<string>("");
  const [isAsignando, setIsAsignando] = useState(false);

  const { data: chequesResponse, isLoading } = useChequesDisponibles();

  // Obtener cheques disponibles (ya filtrados por el backend)
  const chequesDisponibles = chequesResponse?.data || [];

  useEffect(() => {
    if (open) {
      setChequeSeleccionado(null);
      setError("");
      setIsAsignando(false);
    }
  }, [open]);

  const handleChequeChange = (event: React.SyntheticEvent, newValue: Cheque | null) => {
    setChequeSeleccionado(newValue);
    setError("");
  };

  const handleAsignar = async () => {
    if (!chequeSeleccionado) {
      setError("Debe seleccionar un cheque");
      return;
    }

    console.log("🔄 [DEBUG] Iniciando asignación de cheque en modal:", {
      chequeSeleccionado,
      id: chequeSeleccionado.id,
      monto: chequeSeleccionado.monto
    });

    try {
      setIsAsignando(true);
      setError("");
      
      const request = {
        idCheque: typeof chequeSeleccionado.id === 'string' ? parseInt(chequeSeleccionado.id) : chequeSeleccionado.id, // Conversión segura a number
        asignado_a_nomina: true,
        montoAsignado: typeof chequeSeleccionado.monto === 'string' ? parseFloat(chequeSeleccionado.monto) || 0 : (chequeSeleccionado.monto || 0)
      };

      console.log("🔄 [DEBUG] Request a enviar:", request);
      
      // Llamar directamente a la función del componente padre con el POST endpoint
      await onAsignar(request);
      
      console.log("✅ [DEBUG] Asignación completada en modal");
      onClose();
    } catch (error) {
      console.error("❌ [DEBUG] Error asignando cheque en modal:", error);
      setError("Error al asignar el cheque. Intente nuevamente.");
    } finally {
      setIsAsignando(false);
    }
  };

  const handleClose = () => {
    setChequeSeleccionado(null);
    setError("");
    setIsAsignando(false);
    onClose();
  };

  // Función helper para formatear montos de forma segura
  const formatMonto = (monto: number | string | undefined | null): string => {
    if (monto === undefined || monto === null) return '0';
    const numMonto = typeof monto === 'string' ? parseFloat(monto) || 0 : (monto || 0);
    return numMonto.toLocaleString();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '500px',
          maxHeight: '80vh',
          borderRadius: '12px',
          bgcolor: theme.palette.background.paper,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.default
      }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>
          Asignar Cheque
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Selecciona un cheque disponible para asignar a la nómina
          </Typography>

          <Autocomplete
            disablePortal
            options={chequesDisponibles}
            getOptionLabel={(option) => {
              return `${option.correlativo || 'Sin número'} - $${formatMonto(option.monto)}`;
            }}
            value={chequeSeleccionado}
            onChange={handleChequeChange}
            loading={isLoading}
            disabled={isAsignando}
            fullWidth
            ListboxProps={{
              style: { maxHeight: '200px' }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar Cheque"
                error={!!error && !chequeSeleccionado}
                helperText={!chequeSeleccionado && error ? error : ""}
                disabled={isAsignando}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText="No se encontraron cheques disponibles"
            loadingText="Cargando cheques..."
            clearOnBlur
            clearOnEscape
          />

          {chequeSeleccionado && (
            <Box sx={{ 
              bgcolor: "background.default", 
              border: `1px solid ${theme.palette.divider}`, 
              borderRadius: "12px", 
              p: 3 
            }}>
              <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary", mb: 2 }}>
                Información del Cheque
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Número:
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                    {chequeSeleccionado.correlativo || 'Sin número'}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Monto Total:
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                    ${formatMonto(chequeSeleccionado.monto)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Monto Asignado:
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                    ${formatMonto(chequeSeleccionado.monto_asignado)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Estado:
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight={600}>
                    {chequeSeleccionado.asignado_a_nomina ? 'Asignado a nómina' : 'Disponible'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 3, 
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.default
      }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          disabled={isAsignando}
          sx={{
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              bgcolor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
            },
            "&:disabled": {
              opacity: 0.7,
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleAsignar} 
          variant="contained" 
          color="primary"
          disabled={!chequeSeleccionado || isAsignando}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
            boxShadow: "none",
            minWidth: "120px", // Ancho mínimo para evitar saltos
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            "&:disabled": {
              opacity: 0.7,
            }
          }}
        >
          {isAsignando ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Asignar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 