"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  QrCodeScanner as QrCodeIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { stockService } from "@/services/stockService";
import { useProducto } from "@/hooks/useProducto";
import axios from "axios";
import { 
  StockProducto, 
  MOTIVOS_ENTRADA, 
  MOTIVOS_SALIDA
} from "@/types/stock";
import dynamic from "next/dynamic";

// Lazy load the heavy BarcodeScanner component
const BarcodeScanner = dynamic(() => import("../dashboard/BarcodeScanner").then(mod => ({ default: mod.BarcodeScanner })), {
  loading: () => <CircularProgress size={20} />,
  ssr: false
});

interface NuevoMovimientoContentProps {
  tipo: "entrada" | "salida";
}

export function NuevoMovimientoContent({ tipo }: NuevoMovimientoContentProps) {
  const theme = useTheme();
  const { usuario } = useAuth();
  const [productos, setProductos] = useState<StockProducto[]>([]);
  const [motivo, setMotivo] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [colaEscaneos, setColaEscaneos] = useState<string[]>([]);
  const [procesandoCola, setProcesandoCola] = useState(false);
  const [todosLosProductos, setTodosLosProductos] = useState<StockProducto[]>([]);
  const [productosCargados, setProductosCargados] = useState(false);

  // Producto temporal para agregar
  const [tempProducto, setTempProducto] = useState<StockProducto>({
    codigo_producto: "",
    tipo_item: "producto", // Mantenemos el valor por defecto pero no lo mostramos
    cantidad: 1, // Siempre 1 por defecto
    cantidad_minima: 0, // Siempre 0
  });

  // Hook para información del producto (mantenemos para compatibilidad)
  const {
    setCodigoBarras,
    limpiarProducto,
  } = useProducto();

  const motivos = tipo === "entrada" ? MOTIVOS_ENTRADA : MOTIVOS_SALIDA;

  // Monitorear cambios en el código de producto
  useEffect(() => {
    setCodigoBarras(tempProducto.codigo_producto);
  }, [tempProducto.codigo_producto, setCodigoBarras]);

  // Cargar productos al montar el componente
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/productos`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTodosLosProductos(response.data);
        setProductosCargados(true);
        console.log("✅ Productos cargados:", response.data.length);
      } catch (error) {
        console.error("❌ Error cargando productos:", error);
        setError("Error cargando productos");
      }
    };

    cargarProductos();
  }, []);

  // Buscar producto instantáneamente en productos cargados
  const buscarProductoInstantaneo = (codigo: string): StockProducto | null => {
    if (!productosCargados) return null;
    
    // Buscar primero por código exacto
    const productoEncontrado = todosLosProductos.find(p => p.codigo_producto === codigo);
    
    if (productoEncontrado) {
      console.log("🎯 Producto encontrado:", productoEncontrado.nombre_producto);
      return productoEncontrado;
    }
    
    // Si no es producto, buscar si es pack
    const pack = todosLosProductos.find(p => p.codigo_producto === codigo && p.tipo_item === "pack");
    if (pack) {
      console.log("📦 Pack encontrado:", pack.nombre_producto);
      return pack;
    }
    
    console.log("❌ Producto no encontrado:", codigo);
    return null;
  };

  // Procesar cola de escaneos de forma instantánea
  useEffect(() => {
    const procesarCola = async () => {
      if (colaEscaneos.length > 0 && !procesandoCola && productosCargados) {
        setProcesandoCola(true);
        const codigoActual = colaEscaneos[0];
        
        // Buscar producto instantáneamente
        const productoEncontrado = buscarProductoInstantaneo(codigoActual);
        
        if (productoEncontrado) {
          // Agregar directamente al carrito
          const productoParaAgregar = {
            ...productoEncontrado,
            cantidad: 1,
            cantidad_minima: productoEncontrado.cantidad_minima || 0,
          };
          
          // Lógica de pack vs producto
          if (productoEncontrado.tipo_item === "pack") {
            // Buscar el producto individual correspondiente
            const productoIndividual = todosLosProductos.find(p => 
              p.tipo_item === "producto" && 
              p.nombre_producto === productoEncontrado.nombre_producto
            );
            
            if (productoIndividual) {
              productoParaAgregar.codigo_producto = productoIndividual.codigo_producto;
              productoParaAgregar.cantidad = productoEncontrado.cantidad * productoIndividual.cantidad;
              console.log("📦 Pack convertido a producto:", productoIndividual.nombre_producto, "x", productoParaAgregar.cantidad);
            }
          }
          
          // Agregar al carrito
          setProductos(prev => {
            const existingIndex = prev.findIndex(p => p.codigo_producto === productoParaAgregar.codigo_producto);
            if (existingIndex >= 0) {
              // Sumar cantidades
              const updated = [...prev];
              updated[existingIndex].cantidad += productoParaAgregar.cantidad;
              console.log("➕ Cantidad sumada:", updated[existingIndex].cantidad);
              return updated;
            } else {
              // Agregar nuevo producto
              console.log("➕ Nuevo producto agregado:", productoParaAgregar.nombre_producto);
              return [...prev, productoParaAgregar];
            }
          });
          
          setNotification(`✅ ${productoParaAgregar.nombre_producto} agregado`);
          setTimeout(() => setNotification(null), 1000);
        } else {
          setError(`❌ Producto no encontrado: ${codigoActual}`);
        }
        
        // Remover de la cola
        setColaEscaneos(prev => prev.slice(1));
        setProcesandoCola(false);
      }
    };

    procesarCola();
  }, [colaEscaneos, procesandoCola, productosCargados, todosLosProductos]);



  const handleScanSuccess = (result: string) => {
    setTempProducto({ ...tempProducto, codigo_producto: result });
    setShowScanner(false);
  };

  const handleScanError = (error: string) => {
    console.error("Error scanning barcode:", error);
    setShowScanner(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && tempProducto.codigo_producto.trim()) {
      event.preventDefault();
      
      // Agregar a la cola de escaneos
      setColaEscaneos(prev => [...prev, tempProducto.codigo_producto]);
      
      // Limpiar el campo inmediatamente para el siguiente escaneo
      setTempProducto({
        codigo_producto: "",
        tipo_item: "producto",
        cantidad: 1,
        cantidad_minima: 0,
      });
      
      // Mostrar notificación de que se agregó a la cola
      setNotification(`Código ${tempProducto.codigo_producto} agregado a la cola (${colaEscaneos.length + 1} pendientes)`);
      setTimeout(() => setNotification(null), 1500);
    }
  };



  const handleRemoveProducto = (codigo: string) => {
    setProductos(productos.filter(p => p.codigo_producto !== codigo));
  };

  const handleUpdateCantidad = (codigo: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      handleRemoveProducto(codigo);
      return;
    }
    
    setProductos(productos.map(p => 
      p.codigo_producto === codigo 
        ? { ...p, cantidad: nuevaCantidad }
        : p
    ));
  };

  const handleSubmit = async () => {
    if (!usuario?.id_auth_user || !usuario?.id_local) {
      setError("Usuario no autenticado o sin local asignado");
      return;
    }

    if (productos.length === 0) {
      setError("Debe agregar al menos un producto");
      return;
    }

    if (!motivo) {
      setError("Debe seleccionar un motivo");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const request = {
        productos: productos.map(p => ({
          codigo_producto: p.codigo_producto,
          tipo_item: p.tipo_item,
          cantidad: p.cantidad,
          ...(tipo === "entrada" && { cantidad_minima: p.cantidad_minima || 0 })
        })),
        motivo,
        id_local: usuario.id_local,
        id_usuario: usuario.id_auth_user,
        observaciones: observaciones || undefined,
      };

      const response = tipo === "entrada" 
        ? await stockService.entradaMultiple(request)
        : await stockService.salidaMultiple(request);

      if (response.success) {
        setSuccess(response.message);
        setProductos([]);
        setMotivo("");
        setObservaciones("");
        setNotification(null);
        limpiarProducto();
      } else {
        setError("Error al procesar el movimiento");
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err.response as { data?: { error?: string } })?.data?.error || "Error al procesar el movimiento"
        : "Error al procesar el movimiento";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setProductos([]);
    setMotivo("");
    setObservaciones("");
    setError(null);
    setSuccess(null);
    setNotification(null);
    limpiarProducto();
  };

  const totalProductos = productos.length;
  const totalCantidad = productos.reduce((sum, p) => sum + p.cantidad, 0);

  // Debug: mostrar estado del carrito
  useEffect(() => {
    if (productos.length > 0) {
      console.log("Estado actual del carrito:", productos.map(p => ({
        codigo: p.codigo_producto,
        nombre: p.nombre_producto,
        cantidad: p.cantidad,
        tipo: p.tipo_item
      })));
    }
  }, [productos]);

  return (
    <Box>
      {/* Alertas */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {notification && (
        <Alert severity="info" sx={{ mb: 3 }} onClose={() => setNotification(null)}>
          {notification}
        </Alert>
      )}

      {/* Formulario Principal */}
      <Box sx={{ display: "grid", gap: 4, minWidth: 600 }}>
        {/* Sección de Agregar Producto */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: "1rem" }}>
            Agregar Producto
          </Typography>

          <Box sx={{ display: "grid", gap: 3 }}>
            {/* Información del flujo POS */}
            <Box sx={{ 
              p: 2, 
              bgcolor: "info.50", 
              border: 1, 
              borderColor: "info.200",
              borderRadius: 1,
              fontSize: "0.75rem"
            }}>
              <Typography variant="body2" sx={{ color: "info.main", fontWeight: 500, mb: 0.5 }}>
                💡 Flujo POS
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                {productosCargados ? 
                  "Escanea códigos de barras rápidamente. Procesamiento instantáneo." :
                  "Cargando productos... Espera un momento."
                }
              </Typography>
            </Box>

            {/* Código de producto */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                label="Código de Producto"
                value={tempProducto.codigo_producto}
                onChange={(e) => setTempProducto({ ...tempProducto, codigo_producto: e.target.value })}
                onKeyPress={handleKeyPress}
                placeholder={!productosCargados ? "Cargando productos..." : "Ingrese código o escanee"}
                size="small"
                disabled={!productosCargados}
                InputProps={{
                  endAdornment: !productosCargados ? (
                    <CircularProgress size={16} />
                  ) : undefined,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    fontSize: "0.875rem",
                  },
                }}
              />
              <IconButton 
                onClick={() => setShowScanner(true)}
                disabled={!productosCargados}
                sx={{ 
                  border: 1, 
                  borderColor: "divider",
                  borderRadius: 1,
                  width: 40,
                  height: 40,
                }}
              >
                <QrCodeIcon fontSize="small" />
              </IconButton>
            </Box>


          </Box>
        </Box>

        {/* Lista de Productos */}
        {productos.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
                Productos ({totalProductos})
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {colaEscaneos.length > 0 && (
                  <Typography variant="body2" sx={{ color: "info.main", fontWeight: 500 }}>
                    Cola: {colaEscaneos.length} pendientes
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {totalCantidad} unidades
                </Typography>
              </Box>
            </Box>

            <TableContainer sx={{ 
              border: 1, 
              borderColor: "divider", 
              borderRadius: 1,
              minWidth: 600,
            }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      fontSize: "0.75rem", 
                      py: 1.5, 
                      width: "45%",
                      color: theme.palette.text.primary
                    }}>
                      Producto
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      fontSize: "0.75rem", 
                      py: 1.5, 
                      width: "25%",
                      color: theme.palette.text.primary
                    }}>
                      Código
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 600, 
                      fontSize: "0.75rem", 
                      py: 1.5, 
                      width: "20%",
                      color: theme.palette.text.primary
                    }}>
                      Cantidad
                    </TableCell>
                    <TableCell align="center" sx={{ 
                      fontWeight: 600, 
                      fontSize: "0.75rem", 
                      py: 1.5, 
                      width: "10%",
                      color: theme.palette.text.primary
                    }}>
                      Acción
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.map((producto) => (
                    <TableRow key={producto.codigo_producto} hover>
                      <TableCell sx={{ 
                        fontSize: "0.75rem", 
                        py: 1.5,
                        color: theme.palette.text.primary
                      }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.75rem" }}>
                            {producto.nombre_producto || 'Producto'}
                          </Typography>
                          {producto.tipo_item === "pack" && (
                            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.625rem" }}>
                              Desde pack
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        fontSize: "0.75rem", 
                        py: 1.5,
                        color: theme.palette.text.primary
                      }}>
                        {producto.codigo_producto}
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        fontSize: "0.75rem", 
                        py: 1.5,
                        color: theme.palette.text.primary
                      }}>
                        <TextField
                          type="number"
                          value={producto.cantidad}
                          onChange={(e) => handleUpdateCantidad(producto.codigo_producto, parseInt(e.target.value) || 0)}
                          size="small"
                          sx={{ 
                            width: 80,
                            "& .MuiOutlinedInput-root": { 
                              borderRadius: 1, 
                              fontSize: "0.75rem",
                              height: 32
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "6px 8px",
                              textAlign: "center"
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveProducto(producto.codigo_producto)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Configuración del Movimiento */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: "1rem" }}>
            Configuración
          </Typography>

          <Box sx={{ display: "grid", gap: 3 }}>
            <FormControl size="small">
              <InputLabel>Motivo</InputLabel>
              <Select
                value={motivo}
                label="Motivo"
                onChange={(e) => setMotivo(e.target.value)}
                sx={{ borderRadius: 1, fontSize: "0.875rem" }}
              >
                {motivos.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Observaciones"
              multiline
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1, fontSize: "0.875rem" } }}
            />
          </Box>
        </Box>

        {/* Botones de Acción */}
        <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
                        <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={loading || productos.length === 0 || !motivo}
                sx={{ 
                  flex: 1,
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                  fontSize: "0.875rem"
                }}
              >
                {loading ? <CircularProgress size={16} /> : `Registrar ${tipo}`}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClear}
                disabled={loading}
                sx={{ 
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                  fontSize: "0.875rem"
                }}
              >
                Limpiar
              </Button>
        </Box>
      </Box>

      {/* Dialog para scanner */}
      <Dialog open={showScanner} onClose={() => setShowScanner(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Escanear Código de Barras
          </Typography>
        </DialogTitle>
        <DialogContent>
          <BarcodeScanner
            onSuccess={handleScanSuccess}
            onError={handleScanError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowScanner(false)} sx={{ textTransform: "none" }}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 