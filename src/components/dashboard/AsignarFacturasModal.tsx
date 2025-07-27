import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { getFacturasDisponibles } from '@/services/facturaService';
import { nominaChequeService } from '@/services/nominaChequeService';
import { Factura, AsignarFacturaRequest } from '@/types/nominaCheque';
import { useSnackbar } from '@/hooks/useSnackbar';

interface AsignarFacturasModalProps {
  open: boolean;
  onClose: () => void;
  nominaId: string;
  onSuccess?: () => void;
}

export function AsignarFacturasModal({ 
  open, 
  onClose, 
  nominaId, 
  onSuccess 
}: AsignarFacturasModalProps) {
  const [facturasDisponibles, setFacturasDisponibles] = useState<Factura[]>([]);
  const [facturasSeleccionadas, setFacturasSeleccionadas] = useState<AsignarFacturaRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProveedor, setFilterProveedor] = useState('');
  const [proveedores, setProveedores] = useState<string[]>([]);
  const { showSnackbar } = useSnackbar();

  // Función para formatear montos como moneda chilena
  const formatearMoneda = (monto: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto);
  };

  // Cargar facturas disponibles
  const cargarFacturasDisponibles = async () => {
    try {
      setLoading(true);
      const response = await getFacturasDisponibles({
        page: 1,
        limit: 100,
        proveedor: filterProveedor || undefined
        // ❌ Eliminado: estado: 'pendiente' - ya no se usa para disponibilidad
      });
      
      setFacturasDisponibles(response.data);
      
      // Extraer proveedores únicos
      const proveedoresUnicos = [...new Set(response.data.map(f => f.proveedor || '').filter(p => p !== ''))];
      setProveedores(proveedoresUnicos);
    } catch (error) {
      console.error('Error cargando facturas disponibles:', error);
      showSnackbar('Error al cargar facturas disponibles', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Asignar facturas
  const asignarFacturas = async () => {
    if (facturasSeleccionadas.length === 0) {
      showSnackbar('Selecciona al menos una factura', 'warning');
      return;
    }

    try {
      setLoading(true);
      await nominaChequeService.asignarFacturasANomina(nominaId, facturasSeleccionadas);
      showSnackbar('Facturas asignadas correctamente', 'success');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error asignando facturas:', error);
      showSnackbar('Error al asignar facturas', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar factura
  const seleccionarFactura = (factura: Factura, montoAsignado: number) => {
    const nuevaSeleccion: AsignarFacturaRequest = {
      idFactura: factura.id,
      montoAsignado: montoAsignado
    };

    setFacturasSeleccionadas(prev => {
      const existe = prev.find(f => f.idFactura === factura.id);
      if (existe) {
        return prev.map(f => f.idFactura === factura.id ? nuevaSeleccion : f);
      } else {
        return [...prev, nuevaSeleccion];
      }
    });
  };

  // Remover factura seleccionada
  const removerFacturaSeleccionada = (idFactura: string) => {
    setFacturasSeleccionadas(prev => prev.filter(f => f.idFactura !== idFactura));
  };

  // Filtrar facturas por búsqueda
  const facturasFiltradas = facturasDisponibles.filter(factura => {
    // Verificar que folio y proveedor existan antes de usar toLowerCase()
    const folio = factura.folio || '';
    const proveedor = factura.proveedor || '';
    
    const matchesSearch = folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterProveedor || proveedor === filterProveedor;
    return matchesSearch && matchesFilter;
  });

  // Calcular total seleccionado
  const totalSeleccionado = facturasSeleccionadas.reduce((sum, f) => sum + f.montoAsignado, 0);

  useEffect(() => {
    if (open) {
      cargarFacturasDisponibles();
    }
  }, [open, filterProveedor]);

  useEffect(() => {
    if (!open) {
      setFacturasSeleccionadas([]);
      setSearchTerm('');
      setFilterProveedor('');
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <AssignmentIcon />
          Asignar Facturas a Nómina
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Panel de Facturas Disponibles */}
          <Grid item xs={12} md={7}>
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                Facturas Disponibles
              </Typography>
              
              {/* Filtros */}
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  size="small"
                  placeholder="Buscar facturas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon fontSize="small" />,
                  }}
                  sx={{ flex: 1 }}
                />
                
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Proveedor</InputLabel>
                  <Select
                    value={filterProveedor}
                    label="Proveedor"
                    onChange={(e) => setFilterProveedor(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {proveedores.map((proveedor) => (
                      <MenuItem key={proveedor} value={proveedor}>
                        {proveedor}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Lista de Facturas */}
            <Box sx={{ maxHeight: 500, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : facturasFiltradas.length > 0 ? (
                <List>
                  {facturasFiltradas.map((factura) => {
                    const estaSeleccionada = facturasSeleccionadas.some(f => f.idFactura === factura.id);
                    const montoAsignado = facturasSeleccionadas.find(f => f.idFactura === factura.id)?.montoAsignado || factura.monto || 0;
                    
                    return (
                      <ListItem 
                        key={factura.id} 
                        divider
                        sx={{ 
                          bgcolor: estaSeleccionada ? 'action.selected' : 'transparent',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body1" fontWeight={500}>
                                {factura.folio || 'Sin folio'}
                              </Typography>
                              {estaSeleccionada && (
                                <Chip label="Seleccionada" size="small" color="primary" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {factura.proveedor || 'Sin proveedor'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Fecha: {factura.fechaIngreso} | Monto: {formatearMoneda(factura.monto || 0)}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box display="flex" alignItems="center" gap={1}>
                            <TextField
                              size="small"
                              label="Monto"
                              value={formatearMoneda(montoAsignado)}
                              onChange={(e) => {
                                // Remover caracteres no numéricos excepto puntos y comas
                                const valorLimpio = e.target.value.replace(/[^\d.,]/g, '');
                                // Convertir a número, removiendo separadores de miles
                                const monto = parseInt(valorLimpio.replace(/[.,]/g, '')) || 0;
                                seleccionarFactura(factura, monto);
                              }}
                              sx={{ width: 140 }}
                              InputProps={{}}
                            />
                            <Button
                              size="small"
                              variant={estaSeleccionada ? "outlined" : "contained"}
                              onClick={() => {
                                if (estaSeleccionada) {
                                  removerFacturaSeleccionada(factura.id);
                                } else {
                                  seleccionarFactura(factura, factura.monto || 0);
                                }
                              }}
                            >
                              {estaSeleccionada ? 'Remover' : 'Seleccionar'}
                            </Button>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Box p={3} textAlign="center">
                  <Alert severity="info">
                    No hay facturas disponibles con los filtros aplicados
                  </Alert>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Panel de Facturas Seleccionadas */}
          <Grid item xs={12} md={5}>
            <Typography variant="h6" gutterBottom>
              Facturas a Asignar
            </Typography>
            
            <Box sx={{ maxHeight: 500, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              {facturasSeleccionadas.length > 0 ? (
                <>
                  <List>
                    {facturasSeleccionadas.map((seleccion) => {
                      const factura = facturasDisponibles.find(f => f.id === seleccion.idFactura);
                      return factura ? (
                        <ListItem key={seleccion.idFactura} divider>
                          <ListItemText
                            primary={factura.folio || 'Sin folio'}
                            secondary={`${factura.proveedor || 'Sin proveedor'} | ${formatearMoneda(seleccion.montoAsignado)}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              size="small" 
                              onClick={() => removerFacturaSeleccionada(seleccion.idFactura)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ) : null;
                    })}
                  </List>
                  
                  <Box p={2} bgcolor="background.paper" borderTop={1} borderColor="divider">
                    <Typography variant="h6" color="primary">
                      Total: {formatearMoneda(totalSeleccionado)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {facturasSeleccionadas.length} factura(s) seleccionada(s)
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box p={3} textAlign="center">
                  <Alert severity="info">
                    Selecciona facturas de la lista para asignarlas
                  </Alert>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={asignarFacturas}
          variant="contained"
          disabled={facturasSeleccionadas.length === 0 || loading}
          startIcon={loading ? <CircularProgress size={16} /> : <AssignmentIcon />}
        >
          {loading ? 'Asignando...' : `Asignar ${facturasSeleccionadas.length} Factura(s)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 