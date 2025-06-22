"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Stack,
  Chip,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { nominaChequeService } from "@/services/nominaChequeService";

interface FacturaDisponible {
  id: string;
  folio: string;
  proveedor: string;
  monto: number;
}

interface AsignarChequeModalProps {
  open: boolean;
  onClose: () => void;
  onAsignar: (facturaId: string) => Promise<void>;
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
  const [facturas, setFacturas] = useState<FacturaDisponible[]>([]);
  const [selectedFacturaId, setSelectedFacturaId] = useState<string>("");
  const [loadingFacturas, setLoadingFacturas] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  // Cargar facturas disponibles
  useEffect(() => {
    if (open) {
      loadFacturasDisponibles();
    }
  }, [open]);

  const loadFacturasDisponibles = async () => {
    try {
      setLoadingFacturas(true);
      setError(null);
      const facturasData = await nominaChequeService.getFacturasDisponibles();
      setFacturas(facturasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar facturas");
    } finally {
      setLoadingFacturas(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFacturaId) {
      setError("Debes seleccionar una factura");
      return;
    }

    try {
      setError(null);
      await onAsignar(selectedFacturaId);
      
      // Limpiar formulario
      setSelectedFacturaId("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar cheque");
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedFacturaId("");
      setError(null);
      onClose();
    }
  };

  const selectedFactura = facturas.find(f => f.id === selectedFacturaId);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
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
            💳 Asignar Cheque #{numeroCheque}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 0 }}>
          <Box sx={{ mt: 1 }}>
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
            
            <Paper 
              elevation={0}
              sx={{ 
                mb: 3, 
                p: 3, 
                bgcolor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.background.default,
                border: `1px solid ${theme.palette.info.main}`,
                borderRadius: "8px",
              }}
            >
              <Typography variant="body2" sx={{ color: theme.palette.info.main, fontWeight: 600, mb: 2 }}>
                📋 Información del Cheque
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                Número: <strong style={{ color: theme.palette.text.primary }}>#{numeroCheque}</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Estado: <Chip 
                  label="Disponible" 
                  size="small" 
                  sx={{ 
                    bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    border: `1px solid ${theme.palette.divider}`,
                  }} 
                />
              </Typography>
            </Paper>

            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: "text.primary" }}>
                  📄 Seleccionar Factura para Asignar
                </Typography>
              </FormLabel>
              
              {loadingFacturas ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress />
                </Box>
              ) : facturas.length === 0 ? (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mt: 2,
                    borderRadius: "8px",
                    border: `1px solid ${theme.palette.info.light}`,
                    bgcolor: theme.palette.mode === 'light' ? "#eff6ff" : theme.palette.background.default,
                    color: theme.palette.info.main,
                  }}
                >
                  No hay facturas disponibles para asignar
                </Alert>
              ) : (
                <RadioGroup
                  value={selectedFacturaId}
                  onChange={(e) => setSelectedFacturaId(e.target.value)}
                  sx={{ mt: 2 }}
                >
                  <TableContainer component={Paper} variant="outlined" sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: "8px" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "background.default" }}>
                          <TableCell align="center" sx={{ width: 50, borderBottom: `1px solid ${theme.palette.divider}` }}></TableCell>
                          <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                              Folio
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                              Proveedor
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                              Monto
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {facturas.map((factura) => (
                          <TableRow
                            key={factura.id}
                            hover
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "action.hover",
                              },
                              "&:not(:last-child)": {
                                borderBottom: `1px solid ${theme.palette.divider}`,
                              },
                            }}
                            onClick={() => setSelectedFacturaId(factura.id)}
                          >
                            <TableCell align="center">
                              <Radio
                                value={factura.id}
                                checked={selectedFacturaId === factura.id}
                                onChange={(e) => setSelectedFacturaId(e.target.value)}
                                sx={{
                                  color: theme.palette.primary.main,
                                  "&.Mui-checked": {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.5 }}>
                              <Typography variant="body2" fontWeight={500} sx={{ color: theme.palette.text.primary }}>
                                {factura.folio}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.5 }}>
                              <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                {factura.proveedor}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ py: 1.5 }}>
                              <Typography variant="body2" fontWeight={500} sx={{ color: theme.palette.primary.main }}>
                                ${factura.monto?.toLocaleString()}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </RadioGroup>
              )}
            </FormControl>

            {selectedFactura && (
              <Paper 
                elevation={0}
                sx={{ 
                  mt: 3, 
                  p: 3, 
                  bgcolor: theme.palette.mode === 'light' ? theme.palette.success.light : theme.palette.background.default,
                  border: `1px solid ${theme.palette.success.main}`,
                  borderRadius: "8px",
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: theme.palette.success.main, mb: 2 }}>
                  ✅ Factura Seleccionada
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    <strong style={{ color: theme.palette.text.primary }}>Folio:</strong> {selectedFactura.folio}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    <strong style={{ color: theme.palette.text.primary }}>Proveedor:</strong> {selectedFactura.proveedor}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    <strong style={{ color: theme.palette.text.primary }}>Monto:</strong> ${selectedFactura.monto?.toLocaleString()}
                  </Typography>
                </Stack>
              </Paper>
            )}
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
            disabled={loading || !selectedFacturaId || facturas.length === 0}
            startIcon={loading ? <CircularProgress size={16} /> : null}
            sx={{
              bgcolor: theme.palette.warning.main,
              color: theme.palette.mode === 'light' ? "#000" : "#000",
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                bgcolor: theme.palette.warning.dark,
                boxShadow: "none",
              },
              "&:disabled": {
                bgcolor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
              },
            }}
          >
            {loading ? "Asignando..." : "Asignar Cheque"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 