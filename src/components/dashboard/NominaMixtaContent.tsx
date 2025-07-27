import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { nominaChequeService } from '@/services/nominaChequeService';
import { NominaCantera, Factura, AsignarFacturaRequest } from '@/types/nominaCheque';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useNominasCheque } from '@/hooks/useNominasCheque';

interface NominaMixtaContentProps {
  nominaId?: string;
}

export function NominaMixtaContent({ nominaId }: NominaMixtaContentProps) {
  const [facturasDisponibles, setFacturasDisponibles] = useState<Factura[]>([]);
  const [facturasSeleccionadas, setFacturasSeleccionadas] = useState<AsignarFacturaRequest[]>([]);
  const [openAsignarFacturas, setOpenAsignarFacturas] = useState(false);

  const { showSnackbar } = useSnackbar();
  const { 
    selectedNomina: nomina, 
    loadNomina, 
    asignarFacturas, 
    loading 
  } = useNominasCheque();

  // Cargar nómina
  const cargarNomina = async () => {
    if (!nominaId) return;
    
    try {
      await loadNomina(nominaId);
    } catch (error) {
      console.error('Error cargando nómina:', error);
      showSnackbar('Error al cargar la nómina', 'error');
    }
  };

  // Cargar facturas disponibles
  const cargarFacturasDisponibles = async () => {
    try {
      const response = await nominaChequeService.getFacturasDisponibles();
      setFacturasDisponibles(response.data);
    } catch (error) {
      console.error('Error cargando facturas disponibles:', error);
      showSnackbar('Error al cargar facturas disponibles', 'error');
    }
  };

  // Asignar facturas a la nómina
  const handleAsignarFacturas = async () => {
    if (!nominaId || facturasSeleccionadas.length === 0) return;

    try {
      await asignarFacturas(nominaId, facturasSeleccionadas);
      showSnackbar('Facturas asignadas correctamente', 'success');
      setOpenAsignarFacturas(false);
      setFacturasSeleccionadas([]);
      // No necesitamos recargar la nómina manualmente, el hook ya actualiza el cache
    } catch (error) {
      console.error('Error asignando facturas:', error);
      showSnackbar('Error al asignar facturas', 'error');
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

  useEffect(() => {
    if (nominaId) {
      cargarNomina();
    }
  }, [nominaId]);

  useEffect(() => {
    if (openAsignarFacturas) {
      cargarFacturasDisponibles();
    }
  }, [openAsignarFacturas]);

  if (loading && !nomina) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!nomina) {
    return (
      <Box p={3}>
        <Alert severity="info">Selecciona una nómina para ver sus detalles</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Header de la Nómina */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Nómina: {nomina.numeroNomina}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tipo: <Chip 
                label={nomina.tipoNomina.toUpperCase()} 
                color={nomina.tipoNomina === 'mixta' ? 'primary' : 'default'}
                size="small"
              />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estado: <Chip 
                label={nomina.estado.toUpperCase()} 
                color={nomina.estado === 'pendiente' ? 'warning' : 'success'}
                size="small"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} textAlign="right">
            <Button
              variant="contained"
              startIcon={<AssignmentIcon />}
              onClick={() => setOpenAsignarFacturas(true)}
              sx={{ mr: 1 }}
            >
              Asignar Facturas
            </Button>
            <IconButton onClick={cargarNomina} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {/* Información de Balance */}


      {/* Contenido de Cheques y Facturas */}
      <Grid container spacing={3}>
        {/* Columna de Cheques - Solo mostrar si hay cheques */}
        {nomina.cheques && nomina.cheques.length > 0 ? (
          <Grid item xs={12} md={nomina.tipoNomina === 'mixta' ? 6 : 12}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <AccountBalanceIcon color="primary" />
                <Typography variant="h6">Cheques Asignados</Typography>
                <Chip label={nomina.cheques.length} size="small" />
              </Box>
              
              <List>
                {nomina.cheques.map((cheque) => (
                  <ListItem key={cheque.id} divider>
                    <ListItemText
                      primary={`Cheque ${cheque.correlativo}`}
                      secondary={`$${cheque.montoAsignado.toLocaleString()} - ${cheque.idUsuario}`}
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="body2" color="text.secondary">
                        ${cheque.montoAsignado.toLocaleString()}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ) : null}

        {/* Columna de Facturas - Solo mostrar si hay facturas */}
        {nomina.facturas && nomina.facturas.length > 0 ? (
          <Grid item xs={12} md={nomina.tipoNomina === 'mixta' ? 6 : 12}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <ReceiptIcon color="primary" />
                <Typography variant="h6">Facturas Asignadas</Typography>
                <Chip label={nomina.facturas.length} size="small" />
              </Box>
              
              <List>
                {nomina.facturas.map((factura) => (
                  <ListItem key={factura.id} divider>
                    <ListItemText
                      primary={`Factura ${factura.folio}`}
                      secondary={`${factura.proveedor} - ${factura.fechaAsignacion}`}
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="body2" color="text.secondary">
                        ${factura.montoAsignado.toLocaleString()}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ) : null}

        {/* Mensaje cuando no hay ni cheques ni facturas */}
        {(!nomina.cheques || nomina.cheques.length === 0) && 
         (!nomina.facturas || nomina.facturas.length === 0) ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Alert severity="info">
                Esta nómina no tiene cheques ni facturas asignadas. 
                {nomina.tipoNomina === 'mixta' && ' Puedes asignar facturas usando el botón "Asignar Facturas".'}
              </Alert>
            </Paper>
          </Grid>
        ) : null}
      </Grid>

      {/* Dialog para Asignar Facturas */}
      <Dialog 
        open={openAsignarFacturas} 
        onClose={() => setOpenAsignarFacturas(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AssignmentIcon />
            Asignar Facturas a Nómina
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Lista de Facturas Disponibles */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Facturas Disponibles
              </Typography>
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {facturasDisponibles.map((factura) => (
                  <ListItem key={factura.id} divider>
                    <ListItemText
                      primary={`${factura.folio} - ${factura.proveedor}`}
                      secondary={`$${factura.monto.toLocaleString()} - ${factura.fechaEmision}`}
                    />
                    <ListItemSecondaryAction>
                      <TextField
                        type="number"
                        size="small"
                        label="Monto"
                        defaultValue={factura.monto}
                        sx={{ width: 120 }}
                        onChange={(e) => {
                          const monto = parseFloat(e.target.value) || 0;
                          seleccionarFactura(factura, monto);
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Facturas Seleccionadas */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Facturas a Asignar
              </Typography>
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {facturasSeleccionadas.map((seleccion) => {
                  const factura = facturasDisponibles.find(f => f.id === seleccion.idFactura);
                  return factura ? (
                    <ListItem key={seleccion.idFactura} divider>
                      <ListItemText
                        primary={`${factura.folio} - ${factura.proveedor}`}
                        secondary={`$${seleccion.montoAsignado.toLocaleString()}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          size="small" 
                          onClick={() => removerFacturaSeleccionada(seleccion.idFactura)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ) : null;
                })}
              </List>
              
              {facturasSeleccionadas.length === 0 && (
                <Alert severity="info">
                  Selecciona facturas de la lista para asignarlas
                </Alert>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAsignarFacturas(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAsignarFacturas}
            variant="contained"
            disabled={facturasSeleccionadas.length === 0 || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Asignar Facturas'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 