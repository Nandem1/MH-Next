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
        }
      }}
    >
      <DialogTitle>Asignar Cheque</DialogTitle>
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
            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Información del Cheque:
              </Typography>
              <Typography variant="body2">
                Número: {chequeSeleccionado.correlativo || 'Sin número'}
              </Typography>
              <Typography variant="body2">
                Monto Total: ${formatMonto(chequeSeleccionado.monto)}
              </Typography>
              <Typography variant="body2">
                Monto Asignado: ${formatMonto(chequeSeleccionado.monto_asignado)}
              </Typography>
              <Typography variant="body2" color="success.main">
                Estado: {chequeSeleccionado.asignado_a_nomina ? 'Asignado a nómina' : 'Disponible'}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button 
          onClick={handleAsignar} 
          variant="contained" 
          color="primary"
          disabled={!chequeSeleccionado || updateAsignacion.isPending}
        >
          {updateAsignacion.isPending ? "Asignando..." : "Asignar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 