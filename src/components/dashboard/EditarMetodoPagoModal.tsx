"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { Factura, ActualizarMetodoPagoRequest, Cheque } from "@/types/factura";
import { useChequesByProveedor, useFacturasByCheque, useNotasCreditoByCheque, useNotasCreditoByFactura } from "@/hooks/useCheques";
import { useQueryClient } from "@tanstack/react-query";
import { montoAEntero, stringMontoAEntero } from "@/utils/formatearMonto";

interface EditarMetodoPagoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ActualizarMetodoPagoRequest) => Promise<void>;
  factura: Factura | null;
  loading?: boolean;
}

export function EditarMetodoPagoModal({
  open,
  onClose,
  onSubmit,
  factura,
  loading = false,
}: EditarMetodoPagoModalProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [metodoPago, setMetodoPago] = useState<"POR_PAGAR" | "CHEQUE" | "TRANSFERENCIA" | "EFECTIVO">("POR_PAGAR");
  const [montoPagado, setMontoPagado] = useState("");
  const [correlativoCheque, setCorrelativoCheque] = useState("");
  const [chequeSeleccionado, setChequeSeleccionado] = useState<Cheque | null>(null);
  const [usarChequeExistente, setUsarChequeExistente] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener lista de cheques disponibles por proveedor
  const idProveedor = factura?.id_proveedor || 0;
  
  const { data: chequesData, isLoading: isLoadingCheques } = useChequesByProveedor(
    idProveedor, 
    100, 
    0
  );

  // Obtener facturas del cheque seleccionado (cuando se selecciona un cheque)
  const { data: facturasChequeData } = useFacturasByCheque(
    chequeSeleccionado?.id || 0
  );

  // Obtener notas de crédito de todas las facturas del cheque
  const facturas = facturasChequeData?.data?.facturas || [];
  const { data: notasCreditoData } = useNotasCreditoByCheque(facturas);
  
  // Obtener notas de crédito de la factura actual (para cheques nuevos)
  const { data: notasCreditoFacturaIndividual } = useNotasCreditoByFactura(
    factura?.id ? parseInt(factura.id.toString()) : 0
  );
  


  // Calcular monto neto considerando notas de crédito de la factura actual
  const calcularMontoNeto = () => {
    const montoFactura = montoPagado ? stringMontoAEntero(montoPagado) : (factura?.monto || 0);
    
    // Si no hay cheque seleccionado, usar las notas de crédito de la factura actual
    if (!chequeSeleccionado || facturas.length === 0) {
      const notasCreditoFactura = notasCreditoFacturaIndividual?.data?.notas_credito || [];
      const totalNotasCredito = notasCreditoFactura.reduce((sum: number, nc: { monto: number }) => sum + Math.round(nc.monto || 0), 0);
      

      
      return {
        montoFactura,
        totalNotasCredito,
        montoNeto: Math.max(0, montoFactura - totalNotasCredito), // No permitir montos negativos
        notasCredito: notasCreditoFactura.map((nc: { monto: number; id?: number; folio_nc?: string }) => ({
          ...nc,
          facturaId: factura?.id ? parseInt(factura.id.toString()) : 0,
          facturaFolio: factura?.folio || ''
        }))
      };
    }
    
    // Filtrar solo las notas de crédito de la factura actual (para cheques existentes)
    const facturaIdActual = factura?.id ? parseInt(factura.id.toString()) : 0;
    const notasCreditoFacturaActual = notasCreditoData?.notasCredito?.filter(nc => nc.facturaId === facturaIdActual) || [];
    const totalNotasCredito = notasCreditoFacturaActual.reduce((sum, nc) => sum + Math.round(nc.monto || 0), 0);
    

    
    return {
      montoFactura,
      totalNotasCredito,
      montoNeto: Math.max(0, montoFactura - totalNotasCredito), // No permitir montos negativos
      notasCredito: notasCreditoFacturaActual
    };
  };

  // Calcular si el monto es 0 (para validación)
  const montoNeto = calcularMontoNeto();
  const montoEsCero = montoNeto.montoNeto === 0;
  
  const cheques = chequesData?.data?.cheques || [];
  
  // Mostrar todos los cheques del proveedor (sin filtrar por monto disponible)
  const chequesDisponibles = cheques;
  


  // Actualizar valores cuando cambie la factura
  useEffect(() => {
    if (open && factura) {
      setMetodoPago(factura.metodo_pago || "POR_PAGAR");
      setMontoPagado(factura.monto_pagado?.toString() || "");
      setCorrelativoCheque("");
      setChequeSeleccionado(null);
      setUsarChequeExistente(false);
    }
  }, [open, factura]);

  // Forzar re-render cuando cambie el monto pagado para actualizar los labels
  useEffect(() => {
    // Este efecto fuerza la actualización de los labels del autocomplete
    // cuando cambia el monto pagado
  }, [montoPagado]);

  // Si no hay factura, no mostrar el modal
  if (!factura) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (metodoPago === "CHEQUE") {
      if (usarChequeExistente && !chequeSeleccionado) {
        setError("Debe seleccionar un cheque existente");
        return;
      }
      if (!usarChequeExistente && !correlativoCheque.trim()) {
        setError("El correlativo del cheque es requerido");
        return;
      }
      // Nota: Ya no validamos monto disponible porque permitimos usar cheques completos
      // El backend se encargará de validar si el cheque puede pagar la factura
    }

    try {
      setError(null);
      
      // Determinar el monto a enviar según la especificación del backend
      let montoAEnviar: number | undefined;
      let montoCheque: number = 0;
      
      // Calcular monto neto considerando notas de crédito
      const montoNeto = calcularMontoNeto();
      
      if (metodoPago === "CHEQUE") {
        // Para cheques:
        // - cheque.monto: monto del cheque (requerido)
        // - monto_pagado: opcional, para diferencias de pago
        montoCheque = montoPagado ? stringMontoAEntero(montoPagado) : montoNeto.montoNeto;
        
        // Solo enviar monto_pagado si es diferente del monto original de la factura
        // o si el usuario especificó un monto manualmente
        if (montoPagado || montoNeto.totalNotasCredito > 0) {
          montoAEnviar = montoCheque;
        } else {
          montoAEnviar = undefined; // No enviar si no hay diferencia
        }
      } else {
        // Para otros métodos, usar el monto especificado o undefined
        montoAEnviar = montoPagado ? stringMontoAEntero(montoPagado) : undefined;
      }
      
      const data: ActualizarMetodoPagoRequest = {
        id: factura.id,
        metodo_pago: metodoPago,
        monto_pagado: montoAEnviar,
      };



      // Si es cheque, agregar datos del cheque
      if (metodoPago === "CHEQUE") {
        const correlativoFinal = usarChequeExistente && chequeSeleccionado 
          ? chequeSeleccionado.correlativo 
          : correlativoCheque.trim();
        
        data.cheque = {
          correlativo: correlativoFinal,
          monto: montoCheque, // Usar el monto específico para cheques
        };
      }

      // El optimistic update se maneja en el hook useActualizarMetodoPagoFactura
      // para evitar conflictos y duplicación de lógica
      
      // Cerrar modal inmediatamente
      onClose();
      
      // Ejecutar la actualización real en background
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar método de pago");
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMetodoPago(factura.metodo_pago || "POR_PAGAR");
      setMontoPagado(factura.monto_pagado?.toString() || "");
      setCorrelativoCheque("");
      setChequeSeleccionado(null);
      setUsarChequeExistente(false);
      setError(null);
      onClose();
    }
  };

  const getMontoDisponible = (cheque: Cheque) => {
    const montoAsignado = montoAEntero(cheque.monto_asignado);
    const montoTotal = montoAEntero(cheque.monto);
    const montoDisponible = montoTotal - montoAsignado;
    const montoFactura = montoPagado ? stringMontoAEntero(montoPagado) : (factura?.monto || 0);
    
    return {
      montoTotal,
      montoAsignado,
      montoDisponible,
      montoAdicional: montoFactura, // Monto de la factura actual que se va a pagar
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
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          bgcolor: "background.paper",
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: "text.primary" }}>
            Editar Método de Pago
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            Factura {factura.folio} - {factura.proveedor}
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

            {/* Información de notas de crédito */}
            {(() => {
              const montoNeto = calcularMontoNeto();
              return montoNeto.totalNotasCredito > 0 ? (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: "8px",
                    border: `1px solid ${theme.palette.info.light}`,
                    bgcolor: theme.palette.mode === 'light' ? "#f0f9ff" : "#1e3a5f",
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Notas de Crédito detectadas:</strong> La factura {factura?.folio} tiene <strong>${Math.round(montoNeto.totalNotasCredito).toLocaleString('es-CL')}</strong> en notas de crédito que se restarán automáticamente del monto a pagar.
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1 }}>
                    <strong>Monto original:</strong> ${montoNeto.montoFactura.toLocaleString('es-CL')} | 
                    <strong> Notas de crédito:</strong> <span style={{ color: theme.palette.error.main }}>-${Math.round(montoNeto.totalNotasCredito).toLocaleString('es-CL')}</span> | 
                    <strong> Monto neto:</strong> <span style={{ color: theme.palette.success.main }}>${montoNeto.montoNeto.toLocaleString('es-CL')}</span>
                  </Typography>
                  {montoNeto.notasCredito.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        <strong>Detalle:</strong> {montoNeto.notasCredito.length} nota(s) de crédito de la factura {factura?.folio}
                      </Typography>
                      {/* Mostrar detalle de las notas de crédito */}
                      <Box sx={{ mt: 1, maxHeight: '120px', overflowY: 'auto' }}>
                        {montoNeto.notasCredito.slice(0, 3).map((nc: { folio_nc?: string; id?: number; monto: number }, index: number) => (
                          <Typography key={index} variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.75rem' }}>
                            • NC {nc.folio_nc || `#${nc.id}`}: ${Math.round(nc.monto).toLocaleString('es-CL')}
                          </Typography>
                        ))}
                        {montoNeto.notasCredito.length > 3 && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                            ... y {montoNeto.notasCredito.length - 3} nota(s) más
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Alert>
              ) : null;
            })()}

            {/* Alerta cuando el monto es 0 */}
            {montoEsCero && (
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 3, 
                  borderRadius: "8px",
                  border: `1px solid ${theme.palette.warning.light}`,
                  bgcolor: theme.palette.mode === 'light' ? "#fffbeb" : "#2d1b1b",
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Monto no configurado:</strong> Esta factura tiene un monto de $0, lo que indica que no se ha configurado el monto correctamente.
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  <strong>Monto actual:</strong> ${montoNeto.montoFactura.toLocaleString('es-CL')} | 
                  {montoNeto.totalNotasCredito > 0 && (
                    <>
                      <strong> Notas de crédito:</strong> <span style={{ color: theme.palette.error.main }}>-${Math.round(montoNeto.totalNotasCredito).toLocaleString('es-CL')}</span> | 
                    </>
                  )}
                  <strong> Monto neto:</strong> <span style={{ color: theme.palette.success.main }}>$0</span>
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 1 }}>
                  No se puede cambiar el método de pago hasta que se configure un monto válido para la factura.
                </Typography>
              </Alert>
            )}
            
            {/* Método de Pago */}
            <FormControl fullWidth margin="normal" disabled={loading || montoEsCero}>
              <InputLabel>Método de Pago</InputLabel>
              <Select
                value={metodoPago}
                label="Método de Pago"
                onChange={(e) => setMetodoPago(e.target.value as "POR_PAGAR" | "CHEQUE" | "TRANSFERENCIA" | "EFECTIVO")}
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
                <MenuItem value="POR_PAGAR">POR PAGAR</MenuItem>
                <MenuItem value="CHEQUE">CHEQUE</MenuItem>
                <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
              </Select>
            </FormControl>

            {/* Monto Pagado (opcional) */}
            <TextField
              fullWidth
              label={`Monto Pagado (por defecto: $${(() => {
                // Calcular monto neto para el label siempre usando el monto original
                const montoOriginal = factura?.monto || 0;
                const notasCreditoFactura = notasCreditoFacturaIndividual?.data?.notas_credito || [];
                const totalNotasCredito = notasCreditoFactura.reduce((sum: number, nc: { monto: number }) => sum + Math.round(nc.monto || 0), 0);
                const montoNeto = Math.max(0, montoOriginal - totalNotasCredito);
                
                // Si hay notas de crédito, mostrar el monto neto en el label
                // Si no hay notas de crédito, mostrar el monto original
                return totalNotasCredito > 0 
                  ? montoNeto.toLocaleString('es-CL')
                  : montoAEntero(factura.monto).toLocaleString('es-CL');
              })()})`}
              value={montoPagado || (() => {
                const montoNeto = calcularMontoNeto();
                return montoNeto.totalNotasCredito > 0 ? montoNeto.montoNeto.toString() : "";
              })()}
              onChange={(e) => setMontoPagado(e.target.value)}
              placeholder={`Monto de la factura: $${montoAEntero(factura.monto).toLocaleString('es-CL')}`}
              margin="normal"
              disabled={loading || montoEsCero}
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
              helperText={
                <span style={{ color: theme.palette.text.secondary }}>
                  {metodoPago === "CHEQUE" 
                    ? "Dejar vacío para usar el monto por defecto"
                    : "Dejar vacío para usar el monto por defecto"
                  }
                </span>
              }
            />

            {/* Configuración de Cheque */}
            {metodoPago === "CHEQUE" && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: "text.primary" }}>
                  Configuración del Cheque
                </Typography>
                
                {/* Selector de tipo de cheque */}
                <FormControl fullWidth margin="normal" disabled={loading || montoEsCero}>
                  <InputLabel>Tipo de Cheque</InputLabel>
                  <Select
                    value={usarChequeExistente ? "existente" : "nuevo"}
                    label="Tipo de Cheque"
                    onChange={(e) => {
                      setUsarChequeExistente(e.target.value === "existente");
                      setChequeSeleccionado(null);
                      setCorrelativoCheque("");
                    }}
                  >
                    <MenuItem value="nuevo">Nuevo Cheque</MenuItem>
                    <MenuItem value="existente">Usar Cheque Existente</MenuItem>
                  </Select>
                </FormControl>

                {/* Selector de cheque existente */}
                {usarChequeExistente && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Cheques disponibles para el proveedor: <strong>{factura.proveedor}</strong>
                    </Typography>
                    
                    {chequesDisponibles.length === 0 ? (
                      <Alert 
                        severity="info" 
                        sx={{ 
                          mb: 2, 
                          borderRadius: "8px",
                          border: `1px solid ${theme.palette.info.light}`,
                          bgcolor: theme.palette.mode === 'light' ? "#f0f9ff" : "#1e3a5f",
                        }}
                      >
                        No hay cheques disponibles para este proveedor. Puede crear un nuevo cheque.
                      </Alert>
                    ) : (
                      <Autocomplete
                        options={chequesDisponibles}
                        getOptionLabel={(option) => {
                          const info = getMontoDisponible(option);
                          return `${option.correlativo} - $${info.montoTotal.toLocaleString('es-CL')}`;
                        }}
                        value={chequeSeleccionado}
                        onChange={(_, newValue) => {
                          setChequeSeleccionado(newValue);
                          if (newValue) {
                            setCorrelativoCheque(newValue.correlativo);
                          }
                        }}
                        loading={isLoadingCheques}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Seleccionar Cheque Existente"
                            margin="normal"
                            disabled={loading || montoEsCero}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {isLoadingCheques ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        renderOption={(props, option) => {
                          // Evitar pasar key dentro de props spread (React 19 restricción)
                          const { key, ...optionProps } = props as { key?: string } & Record<string, unknown>;
                          return (
                            <Box component="li" key={key} {...optionProps}>
                              <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                <Typography variant="body2" fontWeight={500}>
                                  {option.correlativo}
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
                                  <Chip 
                                    label={`Proveedor: ${factura?.proveedor || "N/A"}`} 
                                    size="small" 
                                    color="secondary" 
                                    variant="outlined"
                                  />
                                </Box>
                              </Box>
                            </Box>
                          );
                        }}
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
                    margin="normal"
                    required
                    disabled={loading || montoEsCero}
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
                        Número de correlativo del cheque
                      </span>
                    }
                  />
                )}

                {/* Información del cheque seleccionado */}
                {chequeSeleccionado && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 2, 
                      borderRadius: "8px",
                      border: `1px solid ${theme.palette.info.light}`,
                      bgcolor: theme.palette.mode === 'light' ? "#f0f9ff" : "#1e3a5f",
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      Cheque seleccionado: {chequeSeleccionado.correlativo}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {(() => {
                        const montoNeto = calcularMontoNeto();
                        const montoCheque = getMontoDisponible(chequeSeleccionado).montoTotal;
                        const sumaTotal = montoCheque + montoNeto.montoNeto;
                        
                        return (
                          <>
                            <span style={{ fontWeight: 600 }}>
                              Suma total: ${sumaTotal.toLocaleString('es-CL')}
                            </span>
                            <span style={{ color: theme.palette.text.secondary }}>
                              {' '}(Cheque: ${montoCheque.toLocaleString('es-CL')} + Neto: ${montoNeto.montoNeto.toLocaleString('es-CL')})
                            </span>
                            {montoNeto.totalNotasCredito > 0 && (
                              <span style={{ color: theme.palette.warning.main, display: 'block', marginTop: '4px' }}>
                                ⚠️ Considerando ${Math.round(montoNeto.totalNotasCredito).toLocaleString('es-CL')} en notas de crédito
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: theme.palette.text.secondary,
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
            disabled={loading || montoEsCero}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
              "&:disabled": {
                bgcolor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Actualizando...
              </Box>
            ) : (
              "Actualizar"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 