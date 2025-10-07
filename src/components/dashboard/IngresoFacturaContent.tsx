"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useProveedores } from "@/hooks/useProveedores";
import { useAuth } from "@/hooks/useAuth";
import { useProductoBusqueda } from "@/hooks/useProductoBusqueda";
import { ProductoFactura } from "@/services/productoService";

interface ProductoIngreso {
  id: string;
  codigoBarra: string;
  nombre: string;
  cantidad: number;
  costoUnitario: number;
  totalCosto: number;
  precio33Margen: number;
  precio23Margen: number;
}

interface DocumentoConfig {
  proveedor: string;
  tipoDocumento: 'factura' | 'notaCredito';
  folio: string;
}

export default function IngresoFacturaContent() {
  const { usuario } = useAuth();
  const { data: proveedores = [], isLoading: loadingProveedores } = useProveedores();
  const { 
    buscarProductoDirecto, 
    error: errorBusqueda,
  } = useProductoBusqueda();
  
  // Función para obtener el nombre del local
  const getNombreLocal = (id_local: number | null): string => {
    switch (id_local) {
      case 1:
        return "LA CANTERA 3055";
      case 2:
        return "LIBERTADOR 1476";
      case 3:
        return "BALMACEDA 599";
      default:
        return "Local no asignado";
    }
  };
  
  // Estado para configuración del documento
  const [documentoConfig, setDocumentoConfig] = useState<DocumentoConfig>({
    proveedor: '',
    tipoDocumento: 'factura',
    folio: '',
  });

  // Estado para productos
  const [productos, setProductos] = useState<ProductoIngreso[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    codigoBarra: '',
    nombre: '',
    cantidad: 1,
    costoUnitario: 0,
  });

  // Estado para búsqueda de productos
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [mostrarBusqueda, setMostrarBusqueda] = useState(true);
  const [productoEncontrado, setProductoEncontrado] = useState<ProductoFactura | null>(null);
  const [buscandoProducto, setBuscandoProducto] = useState(false);
  
  // Referencia para el campo de cantidad
  const cantidadInputRef = useRef<HTMLInputElement>(null);

  // Enfocar el campo de cantidad cuando se encuentra un producto
  useEffect(() => {
    if (!mostrarBusqueda && cantidadInputRef.current) {
      // Pequeño delay para asegurar que el DOM se haya actualizado
      setTimeout(() => {
        cantidadInputRef.current?.focus();
        // Seleccionar todo el texto para sobrescribir
        cantidadInputRef.current?.select();
      }, 100);
    }
  }, [mostrarBusqueda]);

  const handleAgregarProducto = () => {
    if (!nuevoProducto.nombre || nuevoProducto.cantidad <= 0 || nuevoProducto.costoUnitario <= 0) {
      return;
    }

    // Calcular precios con margen
    // 33% margen: precio = costo / (1 - 0.33) = costo / 0.67
    const precio33Margen = nuevoProducto.costoUnitario / 0.67;
    // 23% margen: precio = costo / (1 - 0.23) = costo / 0.77  
    const precio23Margen = nuevoProducto.costoUnitario / 0.77;

    const producto: ProductoIngreso = {
      id: Date.now().toString(),
      codigoBarra: nuevoProducto.codigoBarra,
      nombre: nuevoProducto.nombre,
      cantidad: nuevoProducto.cantidad,
      costoUnitario: nuevoProducto.costoUnitario,
      totalCosto: nuevoProducto.cantidad * nuevoProducto.costoUnitario,
      precio33Margen: precio33Margen,
      precio23Margen: precio23Margen,
    };

    setProductos([...productos, producto]);
    
    // Resetear formulario y volver al modo búsqueda
    setNuevoProducto({
      codigoBarra: '',
      nombre: '',
      cantidad: 1,
      costoUnitario: 0,
    });
    setBusquedaProducto('');
    setMostrarBusqueda(true);
    setProductoEncontrado(null);
    setBuscandoProducto(false);
  };

  const handleEliminarProducto = (id: string) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  const handleLimpiarInputs = () => {
    setNuevoProducto({
      codigoBarra: '',
      nombre: '',
      cantidad: 1,
      costoUnitario: 0,
    });
    setBusquedaProducto('');
    setMostrarBusqueda(true);
    setProductoEncontrado(null);
    setBuscandoProducto(false);
  };

  const handleBuscarProducto = async () => {
    if (!busquedaProducto.trim()) return;
    
    try {
      setBuscandoProducto(true);
      
      // Buscar producto por código de barras usando el servicio real
      const productoReal = await buscarProductoDirecto(busquedaProducto.trim());
      
      if (productoReal && productoReal.nombre_producto) {
        setProductoEncontrado(productoReal);
        setNuevoProducto(prev => ({
          ...prev,
          codigoBarra: busquedaProducto.trim(),
          nombre: productoReal.nombre_producto,
        }));
        setMostrarBusqueda(false);
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setProductoEncontrado(null);
    } finally {
      setBuscandoProducto(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && busquedaProducto.trim()) {
      e.preventDefault();
      handleBuscarProducto();
    }
  };

  const totalGeneral = productos.reduce((sum, producto) => sum + producto.totalCosto, 0);

  // Función para preparar el payload del documento (incluye automáticamente info del usuario)
  const prepararPayloadDocumento = () => {
    if (!usuario) return null;
    
    const payload = {
      // Configuración del documento
      proveedor: documentoConfig.proveedor,
      tipoDocumento: documentoConfig.tipoDocumento,
      folio: documentoConfig.folio,
      
      // Información del usuario autenticado (automática)
      usuario: {
        id: usuario.id_auth_user,
        nombre: usuario.nombre,
        email: usuario.email,
        local: {
          id: usuario.id_local,
          nombre: getNombreLocal(usuario.id_local)
        }
      },
      
      // Productos
      productos: productos,
      total: totalGeneral
    };
    
    // Log temporal para mostrar el payload (se puede remover en producción)
    console.log('Payload del documento:', payload);
    return payload;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
        gap: 3,
        maxWidth: 1200,
        mx: 'auto',
        width: '100%',
      }}
    >
      {/* Primera Sección: Configuración del Documento */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Configuración del Documento
        </Typography>

        <Grid container spacing={3}>
          {/* Proveedor */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              options={proveedores}
              getOptionLabel={(option) => option.nombre || ''}
              loading={loadingProveedores}
              value={proveedores.find(p => p.nombre === documentoConfig.proveedor) || null}
              onChange={(_, newValue) => {
                setDocumentoConfig(prev => ({
                  ...prev,
                  proveedor: newValue?.nombre || '',
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Proveedor"
                  placeholder="Selecciona un proveedor"
                  fullWidth
                  variant="outlined"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    label={option.nombre}
                    size="small"
                  />
                ))
              }
            />
          </Grid>

          {/* Tipo de Documento */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Tipo de Documento</InputLabel>
              <Select
                value={documentoConfig.tipoDocumento}
                onChange={(e) => setDocumentoConfig(prev => ({
                  ...prev,
                  tipoDocumento: e.target.value as 'factura' | 'notaCredito'
                }))}
                label="Tipo de Documento"
              >
                <MenuItem value="factura">Factura Electrónica</MenuItem>
                <MenuItem value="notaCredito">Nota de Crédito</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Folio */}
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Folio"
              variant="outlined"
              value={documentoConfig.folio}
              onChange={(e) => setDocumentoConfig(prev => ({
                ...prev,
                folio: e.target.value
              }))}
              placeholder="Número de folio"
            />
          </Grid>

        </Grid>

        {/* Información del usuario actual */}
        {usuario && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Usuario que ingresa el documento:
              </Typography>
              <Typography variant="body2">
                <strong>Nombre:</strong> {usuario.nombre || 'No disponible'}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {usuario.email}
              </Typography>
              <Typography variant="body2">
                <strong>Local:</strong> {getNombreLocal(usuario.id_local)}
              </Typography>
              <Typography variant="body2">
                <strong>ID Usuario:</strong> {usuario.id_auth_user}
              </Typography>
            </Box>
          </Alert>
        )}
      </Paper>

      {/* Segunda Sección: Productos */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Productos del Documento
        </Typography>

        {/* Búsqueda y agregar producto */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
                   <Grid size={{ xs: 12, md: 6 }}>
                     {mostrarBusqueda ? (
                       <TextField
                         fullWidth
                         label="Buscar producto por código de barras o nombre"
                         variant="outlined"
                         value={busquedaProducto}
                         onChange={(e) => setBusquedaProducto(e.target.value)}
                         onKeyDown={handleKeyDown}
                         placeholder="Ingresa código de barras o nombre y presiona Tab"
                         InputProps={{
                           endAdornment: buscandoProducto ? (
                             <CircularProgress size={20} />
                           ) : busquedaProducto.trim() ? (
                             <SearchIcon color="action" />
                           ) : null
                         }}
                       />
                     ) : (
                       <TextField
                         fullWidth
                         label="Nombre del producto"
                         variant="outlined"
                         value={nuevoProducto.nombre}
                         onChange={(e) => setNuevoProducto(prev => ({
                           ...prev,
                           nombre: e.target.value
                         }))}
                         disabled
                         InputProps={{
                           endAdornment: productoEncontrado ? (
                             <CheckCircleIcon color="success" />
                           ) : errorBusqueda ? (
                             <ErrorIcon color="error" />
                           ) : null
                         }}
                       />
                     )}
                   </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                label="Cantidad"
                type="number"
                variant="outlined"
                value={nuevoProducto.cantidad}
                onChange={(e) => setNuevoProducto(prev => ({
                  ...prev,
                  cantidad: Math.max(1, parseInt(e.target.value) || 1)
                }))}
                inputProps={{ min: 1 }}
                inputRef={cantidadInputRef}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                label="Costo Unitario"
                type="number"
                variant="outlined"
                value={nuevoProducto.costoUnitario}
                onChange={(e) => setNuevoProducto(prev => ({
                  ...prev,
                  costoUnitario: Math.max(0, parseFloat(e.target.value) || 0)
                }))}
                inputProps={{ min: 0, step: 0.01 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAgregarProducto();
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, height: '56px' }}>
                <Button
                  variant="contained"
                  onClick={handleAgregarProducto}
                  disabled={!nuevoProducto.nombre || nuevoProducto.cantidad <= 0 || nuevoProducto.costoUnitario <= 0}
                  sx={{ 
                    flex: 1,
                    height: '100%',
                    minWidth: 0,
                    px: 1
                  }}
                  title="Agregar producto"
                >
                  <AddIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleLimpiarInputs}
                  sx={{ 
                    flex: 1,
                    height: '100%',
                    minWidth: 0,
                    px: 1
                  }}
                  title="Limpiar formulario"
                >
                  <ClearIcon />
                </Button>
              </Box>
                   </Grid>
                 </Grid>
                 
                 {/* Indicadores de estado de búsqueda - Solo errores */}
                 {errorBusqueda && (
                   <Box sx={{ mt: 1, mb: 2 }}>
                     <Alert severity="error" sx={{ py: 0.5 }}>
                       <Typography variant="caption">
                         ❌ {errorBusqueda}
                       </Typography>
                     </Alert>
                   </Box>
                 )}
               </Box>

        {/* Tabla de productos */}
        {productos.length > 0 && (
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Producto</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Cant.</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Costo Unit.</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>33% Margen</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>23% Margen</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Total</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell sx={{ fontSize: '0.75rem' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                          {producto.nombre}
                        </Typography>
                        {producto.codigoBarra && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            Código: {producto.codigoBarra}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{producto.cantidad}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                      ${producto.costoUnitario.toLocaleString('es-CL')}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
                        ${producto.precio33Margen.toLocaleString('es-CL')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
                        ${producto.precio23Margen.toLocaleString('es-CL')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
                        ${producto.totalCosto.toLocaleString('es-CL')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleEliminarProducto(producto.id)}
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Resumen total */}
        {productos.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Total del Documento:
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ${totalGeneral.toLocaleString('es-CL')}
            </Typography>
          </Box>
        )}

        {/* Botones de acción */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mt: 3, 
          justifyContent: 'flex-end',
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}>
          <Button 
            variant="outlined" 
            size="large"
            sx={{ minWidth: 120 }}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            size="large"
            disabled={productos.length === 0 || !documentoConfig.proveedor || !documentoConfig.folio || !usuario}
            onClick={() => prepararPayloadDocumento()}
            sx={{ minWidth: 160 }}
          >
            Guardar Documento
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
