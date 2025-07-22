"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Autocomplete,
  useTheme,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useChequesDisponibles, useUpdateChequeAsignacion } from "@/hooks/useCheques";
import { Cheque } from "@/types/factura";
import { AsignarChequeRequest } from "@/types/nominaCheque";

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

  const { data: chequesResponse, isLoading } = useChequesDisponibles();
  const updateAsignacion = useUpdateChequeAsignacion();

  // Obtener cheques disponibles (ya filtrados por el backend)
  const chequesDisponibles = chequesResponse?.data || [];

  useEffect(() => {
    if (open) {
      setChequeSeleccionado(null);
      setError("");
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

    try {
      // Marcar el cheque como asignado
      await updateAsignacion.mutateAsync({
        chequeId: chequeSeleccionado.id,
        asignado: true
      });

      // Llamar a la función del componente padre
      onAsignar({ 
        idCheque: chequeSeleccionado.id.toString(),
        asignado_a_nomina: true,
        montoAsignado: typeof chequeSeleccionado.monto === 'string' ? parseFloat(chequeSeleccionado.monto) || 0 : (chequeSeleccionado.monto || 0)
      });
      onClose();
    } catch (error) {
      console.error("Error asignando cheque:", error);
      setError("Error al asignar el cheque. Intente nuevamente.");
    }
  };

  const handleClose = () => {
    setChequeSeleccionado(null);
    setError("");
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
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleAsignar} 
          variant="contained" 
          color="primary"
          disabled={!chequeSeleccionado || updateAsignacion.isPending}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          {updateAsignacion.isPending ? "Asignando..." : "Asignar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 