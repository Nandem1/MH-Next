"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box, Autocomplete, CircularProgress, useTheme, Stack, FormControl, InputLabel, Select, MenuItem, Alert, Chip,
} from "@mui/material";
import { AsignarChequeRequest, AsignarChequeAFacturaRequest } from "@/types/nominaCheque";
import { CrearChequeRequest } from "@/types/factura";
import { Cheque } from "@/types/factura";
import { useChequesByProveedor } from "@/hooks/useCheques";
import { FacturaAsignada } from "@/types/nominaCheque";
import { montoAEntero } from "@/utils/formatearMonto";

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
  const theme = useTheme();
  const [chequeSeleccionado, setChequeSeleccionado] = useState<Cheque | null>(null);
  const [usarChequeExistente, setUsarChequeExistente] = useState(true);
  const [correlativoCheque, setCorrelativoCheque] = useState("");
  const [error, setError] = useState<string>("");
  const [isAsignando, setIsAsignando] = useState(false);

  // Obtener cheques disponibles por proveedor
  const idProveedor = factura?.id_proveedor || 0;
  
  const { data: chequesResponse, isLoading } = useChequesByProveedor(
    idProveedor, 
    100, 
    0
  );

  // Obtener cheques disponibles
  const chequesDisponibles = chequesResponse?.data?.cheques || [];

  useEffect(() => {
    if (open) {
      setChequeSeleccionado(null);
      setCorrelativoCheque("");
      setUsarChequeExistente(true);
      setError("");
      setIsAsignando(false);
    }
  }, [open]);

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
        
        const asignacionRequest: AsignarChequeAFacturaRequest = {
          correlativo: chequeSeleccionado.correlativo,
          monto: typeof chequeSeleccionado.monto === 'string' ? parseFloat(chequeSeleccionado.monto) || 0 : (chequeSeleccionado.monto || 0)
        };
        
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
        
        const montoFactura = factura.montoAsignado || factura.monto || 0;
        
        await onCrearYAsignar(nominaId, parseInt(factura.id), {
          correlativo: correlativoCheque.trim(),
          monto: montoFactura,
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
    setUsarChequeExistente(true);
    setError("");
    setIsAsignando(false);
    onClose();
  };

  const formatMonto = (monto: number | string | undefined | null): string => {
    if (monto === undefined || monto === null) return '0';
    const numMonto = typeof monto === 'string' ? parseFloat(monto) || 0 : (monto || 0);
    return numMonto.toLocaleString();
  };

  const getMontoDisponible = (cheque: Cheque) => {
    const montoAsignado = montoAEntero(cheque.monto_asignado);
    const montoTotal = montoAEntero(cheque.monto);
    const montoDisponible = montoTotal - montoAsignado;
    
    return {
      montoTotal,
      montoAsignado,
      montoDisponible,
      porcentajeUsado: montoAsignado > 0 ? Math.round((montoAsignado / montoTotal) * 100) : 0
    };
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
          Asignar Cheque a Factura
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Selecciona un cheque existente o crea uno nuevo para asignar a la factura
          </Typography>

          {factura && (
            <Box sx={{
              bgcolor: "background.default",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "12px",
              p: 3
            }}>
              <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary", mb: 2 }}>
                Información de la Factura
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Folio:
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                    {factura.folio}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Proveedor:
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                    {factura.proveedor}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Monto Factura:
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                    ${formatMonto(factura.monto)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Monto Asignado:
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                    ${formatMonto(factura.montoAsignado)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: "8px",
                border: `1px solid ${theme.palette.error.light}`,
                bgcolor: theme.palette.mode === 'light' ? "#fef2f2" : "#2d1b1b",
                color: "error.main",
              }}
            >
              {error}
            </Alert>
          )}

          {/* Selector de tipo de cheque */}
          <FormControl fullWidth disabled={isAsignando}>
            <InputLabel>Tipo de Cheque</InputLabel>
            <Select
              value={usarChequeExistente ? "existente" : "nuevo"}
              label="Tipo de Cheque"
              onChange={(e) => {
                setUsarChequeExistente(e.target.value === "existente");
                setChequeSeleccionado(null);
                setCorrelativoCheque("");
                setError("");
              }}
              sx={{
                borderRadius: "8px",
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
            >
              <MenuItem value="existente">Usar Cheque Existente</MenuItem>
              <MenuItem value="nuevo">Crear Nuevo Cheque</MenuItem>
            </Select>
          </FormControl>

          {/* Selector de cheque existente */}
          {usarChequeExistente && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Cheques disponibles:
              </Typography>
              
              {chequesDisponibles.length === 0 ? (
                <Alert 
                  severity="info" 
                  sx={{ 
                    borderRadius: "8px",
                    border: `1px solid ${theme.palette.info.light}`,
                    bgcolor: theme.palette.mode === 'light' ? "#f0f9ff" : "#1e3a5f",
                  }}
                >
                  No hay cheques disponibles. Puede crear un nuevo cheque.
                </Alert>
              ) : (
                <Autocomplete
                  options={chequesDisponibles}
                  getOptionLabel={(option) => {
                    const info = getMontoDisponible(option);
                    return `${option.correlativo || 'Sin número'} - $${info.montoTotal.toLocaleString('es-CL')}`;
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
                  renderOption={({ key, ...props }, option) => (
                    <Box component="li" key={key} {...props}>
                      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <Typography variant="body2" fontWeight={500}>
                          {option.correlativo || 'Sin número'}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={`Total: $${getMontoDisponible(option).montoTotal.toLocaleString('es-CL')}`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          {option.cantidad_facturas && (
                            <Chip 
                              label={`${option.cantidad_facturas} facturas`} 
                              size="small" 
                              color="info" 
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  )}
                  noOptionsText="No se encontraron cheques disponibles"
                  loadingText="Cargando cheques..."
                  clearOnBlur
                  clearOnEscape
                />
              )}
            </Box>
          )}

          {/* Campo de correlativo para nuevo cheque */}
          {!usarChequeExistente && (
            <TextField
              fullWidth
              label="Correlativo del Cheque"
              value={correlativoCheque}
              onChange={(e) => setCorrelativoCheque(e.target.value)}
              placeholder="Ej: CH-001-2024"
              disabled={isAsignando}
              required
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
              helperText={
                <span style={{ color: theme.palette.text.secondary }}>
                  Número de correlativo del nuevo cheque
                </span>
              }
            />
          )}

          {/* Información del cheque seleccionado */}
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
          disabled={
            isAsignando || 
            (usarChequeExistente && !chequeSeleccionado) ||
            (!usarChequeExistente && !correlativoCheque.trim())
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
            boxShadow: "none",
            minWidth: "120px",
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
            usarChequeExistente ? "Asignar" : "Crear y Asignar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 