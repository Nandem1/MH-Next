"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box, Autocomplete, CircularProgress, Stack, FormControl, InputLabel, Select, MenuItem, Alert,
} from "@mui/material";
import { AsignarChequeAFacturaRequest } from "@/types/nominaCheque";
import { CrearChequeRequest } from "@/types/factura";
import { Cheque } from "@/types/factura";
import { useChequesByProveedor } from "@/hooks/useCheques";
import { useNotasCreditoByFactura } from "@/hooks/useNotasCredito";
import { FacturaAsignada } from "@/types/nominaCheque";
import { stringMontoAEntero } from "@/utils/formatearMonto";

interface AsignarChequeAFacturaModalProps {
  open: boolean;
  onClose: () => void;
  onAsignar: (nominaId: string, facturaId: number, request: AsignarChequeAFacturaRequest) => void;
  onCrearYAsignar?: (nominaId: string, facturaId: number, request: CrearChequeRequest) => void;
  factura: FacturaAsignada | null;
  nominaId: string;
}

export function AsignarChequeAFacturaModal({
  open, onClose, onAsignar, onCrearYAsignar, factura, nominaId,
}: AsignarChequeAFacturaModalProps) {
  const [chequeSeleccionado, setChequeSeleccionado] = useState<Cheque | null>(null);
  const [usarChequeExistente, setUsarChequeExistente] = useState(true);
  const [correlativoCheque, setCorrelativoCheque] = useState("");
  const [montoManual, setMontoManual] = useState("");
  const [error, setError] = useState<string>("");
  const [isAsignando, setIsAsignando] = useState(false);

  // Obtener cheques disponibles por proveedor
  const idProveedor = factura?.id_proveedor || 0;
  
  const { data: chequesResponse, isLoading } = useChequesByProveedor(
    idProveedor, 
    100, 
    0
  );

  // Obtener notas de crédito de la factura actual
  const facturaId = factura?.id ? parseInt(factura.id) : 0;
  const { data: notasCreditoData } = useNotasCreditoByFactura(facturaId);

  // Obtener cheques disponibles
  const chequesDisponibles = chequesResponse?.data?.cheques || [];

  useEffect(() => {
    if (open) {
      setChequeSeleccionado(null);
      setCorrelativoCheque("");
      setMontoManual("");
      setUsarChequeExistente(true);
      setError("");
      setIsAsignando(false);
    }
  }, [open]);

  // Calcular monto neto considerando notas de crédito
  const calcularMontoNeto = () => {
    const montoFactura = factura?.montoAsignado || factura?.monto || 0;
    const montoManualNumero = montoManual ? stringMontoAEntero(montoManual) : 0;
    
    // Obtener notas de crédito de la factura
    const notasCreditoFactura = notasCreditoData?.data?.notas_credito || [];
    const totalNotasCredito = notasCreditoFactura.reduce((sum: number, nc: { monto: number }) => sum + Math.round(nc.monto || 0), 0);
    
    // Calcular monto neto
    const montoBase = montoManualNumero > 0 ? montoManualNumero : montoFactura;
    const montoNeto = Math.max(0, montoBase - totalNotasCredito); // No permitir montos negativos
    
    return {
      montoFactura,
      montoManual: montoManualNumero,
      totalNotasCredito,
      montoNeto,
      notasCredito: notasCreditoFactura.map((nc: { monto: number; id?: number; folio_nc?: string }) => ({
        ...nc,
        facturaId: facturaId,
        facturaFolio: factura?.folio || ''
      }))
    };
  };

  const handleChequeChange = (event: React.SyntheticEvent, newValue: Cheque | null) => {
    setChequeSeleccionado(newValue);
    setError("");
  };

  const handleAsignar = async () => {
    if (!factura) {
      setError("No hay factura seleccionada");
      return;
    }

    if (usarChequeExistente) {
      // Asignar cheque existente
      if (!chequeSeleccionado) {
        setError("Debe seleccionar un cheque");
        return;
      }

      try {
        setIsAsignando(true);
        setError("");
        
        // Calcular monto neto considerando notas de crédito
        const montoNeto = calcularMontoNeto();
        
        // Usar el monto neto en lugar del monto completo del cheque
        const montoAAsignar = montoNeto.montoNeto;
        
        const asignacionRequest: AsignarChequeAFacturaRequest = {
          correlativo: chequeSeleccionado.correlativo,
          monto: montoAAsignar // Usar monto neto en lugar del monto completo del cheque
        };
        
        console.log("🔄 [DEBUG] Asignando cheque con monto neto:", {
          montoOriginal: chequeSeleccionado.monto,
          montoNeto: montoAAsignar,
          totalNotasCredito: montoNeto.totalNotasCredito,
          notasCredito: montoNeto.notasCredito.length
        });
        
        await onAsignar(nominaId, parseInt(factura.id), asignacionRequest);
        onClose();
      } catch (error) {
        console.error("Error asignando cheque a factura:", error);
        setError("Error al asignar el cheque. Intente nuevamente.");
      } finally {
        setIsAsignando(false);
      }
    } else {
      // Crear nuevo cheque y asignar
      if (!correlativoCheque.trim()) {
        setError("El correlativo del cheque es requerido");
        return;
      }

      if (!onCrearYAsignar) {
        setError("Función de crear cheque no disponible");
        return;
      }

      try {
        setIsAsignando(true);
        setError("");
        
        // Calcular monto neto considerando notas de crédito
        const montoNeto = calcularMontoNeto();
        
        await onCrearYAsignar(nominaId, parseInt(factura.id), {
          correlativo: correlativoCheque.trim(),
          monto: montoNeto.montoNeto, // Usar monto neto
        });
        onClose();
      } catch (error) {
        console.error("Error creando y asignando cheque:", error);
        setError("Error al crear y asignar el cheque. Intente nuevamente.");
      } finally {
        setIsAsignando(false);
      }
    }
  };

  const handleClose = () => {
    setChequeSeleccionado(null);
    setCorrelativoCheque("");
    setMontoManual("");
    setUsarChequeExistente(true);
    setError("");
    setIsAsignando(false);
    onClose();
  };

  // Calcular monto neto para mostrar información
  const montoNeto = calcularMontoNeto();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div">
          Asignar Cheque a Factura
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecciona un cheque existente o crea uno nuevo
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Stack spacing={2}>
          {/* Información de la factura - más compacta */}
          {factura && (
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {factura.folio} - {factura.proveedor}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monto: ${factura.montoAsignado?.toLocaleString('es-CL') || factura.monto?.toLocaleString('es-CL') || '0'}
              </Typography>
              
              {/* Mostrar información de notas de crédito solo si existen */}
              {montoNeto.totalNotasCredito > 0 && (
                <Typography variant="body2" color="info.main" sx={{ mt: 0.5 }}>
                  Notas de crédito: ${montoNeto.totalNotasCredito.toLocaleString('es-CL')} 
                  → Neto: ${montoNeto.montoNeto.toLocaleString('es-CL')}
                </Typography>
              )}
            </Box>
          )}

          {/* Campo para monto manual - más compacto */}
          <TextField
            label="Monto Manual (opcional)"
            value={montoManual}
            onChange={(e) => setMontoManual(e.target.value)}
            placeholder="Dejar vacío para usar monto asignado"
            fullWidth
            size="small"
            helperText="Si especifica un monto, se usará en lugar del monto asignado"
          />

          {/* Tipo de cheque */}
          <FormControl fullWidth size="small">
            <InputLabel>Tipo de Cheque</InputLabel>
            <Select
              value={usarChequeExistente ? "existente" : "nuevo"}
              onChange={(e) => setUsarChequeExistente(e.target.value === "existente")}
              label="Tipo de Cheque"
            >
              <MenuItem value="existente">Usar Cheque Existente</MenuItem>
              <MenuItem value="nuevo">Crear Nuevo Cheque</MenuItem>
            </Select>
          </FormControl>

          {usarChequeExistente ? (
            // Seleccionar cheque existente
            <Autocomplete
              options={chequesDisponibles}
              getOptionLabel={(option) => `${option.correlativo} - $${option.monto?.toLocaleString('es-CL') || '0'}`}
              value={chequeSeleccionado}
              onChange={handleChequeChange}
              loading={isLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar Cheque"
                  placeholder="Buscar cheque..."
                  size="small"
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
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2">
                      <strong>{option.correlativo}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ${option.monto?.toLocaleString('es-CL') || '0'} - {option.nombre_usuario || 'Sin usuario'}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          ) : (
            // Crear nuevo cheque
            <TextField
              label="Correlativo del Cheque"
              value={correlativoCheque}
              onChange={(e) => setCorrelativoCheque(e.target.value)}
              placeholder="Ej: CHQ-001"
              fullWidth
              size="small"
              required
            />
          )}

          {/* Mostrar información del monto que se va a asignar - más compacta */}
          {montoNeto.montoNeto > 0 && (
            <Alert severity="success" sx={{ py: 1 }}>
              <Typography variant="body2">
                <strong>Monto a asignar:</strong> ${montoNeto.montoNeto.toLocaleString('es-CL')}
              </Typography>
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ py: 1 }}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isAsignando}>
          Cancelar
        </Button>
        <Button
          onClick={handleAsignar}
          variant="contained"
          disabled={isAsignando || (usarChequeExistente && !chequeSeleccionado) || (!usarChequeExistente && !correlativoCheque.trim())}
          startIcon={isAsignando ? <CircularProgress size={16} /> : null}
        >
          {isAsignando ? "Asignando..." : "Asignar Cheque"}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 