import React, { useState, useEffect, useCallback } from 'react';
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
  Autocomplete,
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';
import { getFacturasDisponibles } from '@/services/facturaService';
import { nominaChequeService } from '@/services/nominaChequeService';
import { AsignarFacturaRequest } from '@/types/nominaCheque';
import { Factura } from '@/types/factura';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useDebounce } from '@/hooks/useDebounce';
import { useProveedores } from '@/hooks/useProveedores';

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
  const [searchLoading, setSearchLoading] = useState(false); // Estado separado para loading de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProveedor, setFilterProveedor] = useState('');
  const { showSnackbar } = useSnackbar();
  
  // Cargar proveedores usando el hook como en la tabla de facturas
  const { data: proveedores, isLoading: isLoadingProveedores } = useProveedores();
  
  // Usar debounce para la búsqueda por folio - aumentado a 1.5 segundos para mejor rendimiento
  const debouncedSearchTerm = useDebounce(searchTerm, 1500);

  // Función para formatear montos como moneda chilena
  const formatearMoneda = (monto: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto);
  };

  // Función estable para cargar facturas - optimizada para mejor rendimiento
  const cargarFacturasDisponibles = useCallback(async (filtros?: { proveedor?: string; folio?: string }) => {
    try {
      // Usar loading general para carga inicial y filtros de proveedor
      if (!filtros?.folio) {
        setLoading(true);
      } else {
        // Usar searchLoading solo para búsquedas por folio
        setSearchLoading(true);
      }
      
      // Optimización: Solo hacer la llamada si hay filtros válidos o es la carga inicial
      const tieneFiltros = filtros?.proveedor || filtros?.folio;
      const esCargaInicial = !filtros?.proveedor && !filtros?.folio;
      
      if (tieneFiltros || esCargaInicial) {
        const response = await getFacturasDisponibles({
          page: 1,
          limit: 20,
          proveedor: filtros?.proveedor || undefined,
          folio: filtros?.folio || undefined
        });
        
        setFacturasDisponibles(response.data);
      }
    } catch (error) {
      console.error('Error cargando facturas disponibles:', error);
      showSnackbar('Error al cargar facturas disponibles', 'error');
    } finally {
      // Limpiar el loading correspondiente
      if (!filtros?.folio) {
        setLoading(false);
      } else {
        setSearchLoading(false);
      }
    }
  }, [showSnackbar]);

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
      idFactura: parseInt(factura.id),
      montoAsignado: montoAsignado
    };

    setFacturasSeleccionadas(prev => {
      const existe = prev.find(f => f.idFactura === parseInt(factura.id));
      if (existe) {
        return prev.map(f => f.idFactura === parseInt(factura.id) ? nuevaSeleccion : f);
      } else {
        return [...prev, nuevaSeleccion];
      }
    });
  };

  // Remover factura seleccionada
  const removerFacturaSeleccionada = (idFactura: string) => {
    setFacturasSeleccionadas(prev => prev.filter(f => f.idFactura !== parseInt(idFactura)));
  };

  // Ya no necesitamos filtrar localmente porque el backend maneja la búsqueda
  // Memoizar las facturas filtradas para evitar re-renders innecesarios
  const facturasFiltradas = React.useMemo(() => facturasDisponibles, [facturasDisponibles]);

  // Calcular total seleccionado - memoizado para mejor rendimiento
  const totalSeleccionado = React.useMemo(() => 
    facturasSeleccionadas.reduce((sum, f) => sum + f.montoAsignado, 0), 
    [facturasSeleccionadas]
  );

  // Cargar facturas cuando se abre el modal - optimizado
  useEffect(() => {
    if (open) {
      cargarFacturasDisponibles({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // Solo depende de open

  // Cargar facturas cuando cambia el filtro de proveedor - optimizado
  useEffect(() => {
    if (open && filterProveedor && filterProveedor.trim() !== '') {
      cargarFacturasDisponibles({ proveedor: filterProveedor.trim() });
    } else if (open && filterProveedor === '') {
      // Si se limpia el filtro, recargar sin filtros
      cargarFacturasDisponibles({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterProveedor, open]); // Solo depende de filterProveedor y open

  // Cargar facturas cuando cambia la búsqueda por folio - optimizado
  useEffect(() => {
    if (open && debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
      cargarFacturasDisponibles({ folio: debouncedSearchTerm.trim() });
    } else if (open && debouncedSearchTerm === '') {
      // Si se limpia la búsqueda, recargar sin filtros
      cargarFacturasDisponibles({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, open]); // Solo depende de debouncedSearchTerm y open

  useEffect(() => {
    if (!open) {
      setFacturasSeleccionadas([]);
      setSearchTerm('');
      setFilterProveedor('');
      setSearchLoading(false);
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '600px',
          maxHeight: '90vh',
          borderRadius: '12px',
          bgcolor: 'background.paper',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2, 
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default'
      }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }}>
          Asignar Facturas a Nómina
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Selecciona las facturas disponibles para asignar a la nómina
          </Typography>

          {/* Filtros */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Buscar por folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />,
                endAdornment: searchLoading && (
                  <CircularProgress size={16} />
                ),
              }}
              sx={{ 
                flex: 1,
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
              helperText={
                searchTerm.trim() !== '' && debouncedSearchTerm !== searchTerm 
                  ? "Escribiendo... (espera 1.5 segundos)" 
                  : searchLoading 
                  ? "Buscando..." 
                  : ""
              }
            />
            
            <Autocomplete
              disablePortal
              options={proveedores || []}
              getOptionLabel={(option) => option.nombre}
              value={proveedores?.find(p => p.nombre === filterProveedor) || null}
              onChange={(_, newValue) => setFilterProveedor(newValue?.nombre || '')}
              loading={isLoadingProveedores}
              size="small"
              sx={{ 
                minWidth: 200,
                maxWidth: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Proveedor"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingProveedores ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              noOptionsText="No se encontraron proveedores"
              loadingText="Cargando proveedores..."
              clearOnBlur
              clearOnEscape
            />
          </Box>

          {/* Lista de Facturas */}
          <Box sx={{ 
            flex: 1, 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px',
            overflow: 'hidden',
            bgcolor: 'background.default'
          }}>
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Facturas Disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {facturasFiltradas.length} factura(s) encontrada(s)
              </Typography>
            </Box>
            
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {loading ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : facturasFiltradas.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {facturasFiltradas.map((factura) => {
                    const estaSeleccionada = facturasSeleccionadas.some(f => f.idFactura === parseInt(factura.id));
                    const montoAsignado = facturasSeleccionadas.find(f => f.idFactura === parseInt(factura.id))?.montoAsignado || factura.monto || 0;
                    
                    return (
                      <ListItem 
                        key={factura.id} 
                        sx={{ 
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          bgcolor: estaSeleccionada ? 'action.selected' : 'transparent',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body1" fontWeight={600}>
                                {factura.folio || 'Sin folio'}
                              </Typography>
                              {estaSeleccionada && (
                                <Chip 
                                  label="Seleccionada" 
                                  size="small" 
                                  color="primary" 
                                  sx={{ borderRadius: '6px' }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box component="div">
                              <Box component="div" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                {factura.proveedor || 'Sin proveedor'}
                              </Box>
                              <Box component="div" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                                Fecha: {factura.fechaIngreso} | Monto: {formatearMoneda(factura.monto || 0)}
                              </Box>
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
                                const valorLimpio = e.target.value.replace(/[^\d.,]/g, '');
                                const monto = parseInt(valorLimpio.replace(/[.,]/g, '')) || 0;
                                seleccionarFactura(factura, monto);
                              }}
                              sx={{ 
                                width: 140,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '6px'
                                }
                              }}
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
                              sx={{ 
                                borderRadius: '6px',
                                textTransform: 'none',
                                fontWeight: 500
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
                  <Alert severity="info" sx={{ borderRadius: '8px' }}>
                    {searchLoading 
                      ? `Buscando facturas con folio "${searchTerm}"...`
                      : debouncedSearchTerm 
                      ? `No se encontraron facturas con el folio "${debouncedSearchTerm}"`
                      : searchTerm.trim() !== '' && debouncedSearchTerm !== searchTerm
                      ? `Escribiendo... (espera 1.5 segundos)`
                      : 'No hay facturas disponibles con los filtros aplicados'
                    }
                  </Alert>
                </Box>
              )}
            </Box>
          </Box>

          {/* Resumen de Selección */}
          {facturasSeleccionadas.length > 0 && (
            <Box sx={{ 
              bgcolor: 'background.default', 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '12px', 
              p: 3 
            }}>
              <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary', mb: 2 }}>
                Resumen de Selección
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Facturas seleccionadas:
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
                  {facturasSeleccionadas.length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Total a asignar:
                </Typography>
                <Typography variant="h6" color="primary" fontWeight={600}>
                  {formatearMoneda(totalSeleccionado)}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 3, 
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default'
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          disabled={loading}
          sx={{
            borderColor: 'divider',
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            px: 3,
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            },
            '&:disabled': {
              opacity: 0.7,
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={asignarFacturas}
          variant="contained" 
          color="primary"
          disabled={facturasSeleccionadas.length === 0 || loading}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            px: 3,
            boxShadow: 'none',
            minWidth: '120px',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            '&:disabled': {
              opacity: 0.7,
            }
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            `Asignar ${facturasSeleccionadas.length} Factura(s)`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 