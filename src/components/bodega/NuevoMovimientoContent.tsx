"use client";

import { useState } from "react";
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
import { useStock } from "@/hooks/useStock";
import stockService from "@/services/stockService";
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
  const { 
    entradaMultiple, 
    salidaMultiple, 
    loadingEntradaMultiple, 
    loadingSalidaMultiple,
  } = useStock(usuario?.id_local || 1);
  const [productos, setProductos] = useState<StockProducto[]>([]);
  const [motivo, setMotivo] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isBuscandoProducto, setIsBuscandoProducto] = useState(false);
  // Producto temporal para agregar
  const [tempProducto, setTempProducto] = useState<StockProducto>({
    codigo_producto: "",
    tipo_item: "producto",
    cantidad: 1,
    cantidad_minima: 0,
  });

  const motivos = tipo === "entrada" ? MOTIVOS_ENTRADA : MOTIVOS_SALIDA;

  // Flujo POS optimizado - Sin carga inicial ni búsquedas automáticas

  // Flujo POS optimizado - Buscar producto real y agregar al carrito
  const agregarProductoDirecto = async (codigo: string) => {
    // Protección contra múltiples llamadas
    if (isBuscandoProducto) {
      return;
    }
    
    setIsBuscandoProducto(true);
    setError(null); // Limpiar errores anteriores
    
    try {
      // Buscar producto real en el backend con cache optimizado
      const productoReal = await stockService.getProductoByBarcode(codigo);
      
      // Verificar si ya existe en el carrito
      const existingIndex = productos.findIndex(p => p.codigo_producto === productoReal.codigo_producto);
      
      if (existingIndex >= 0) {
        // Sumar cantidad usando patrón funcional para evitar problemas con React Strict Mode
        setProductos(prev => {
          const updated = [...prev];
          const cantidadAnterior = updated[existingIndex].cantidad;
          updated[existingIndex] = {
            ...updated[existingIndex],
            cantidad: cantidadAnterior + productoReal.cantidad
          };
          return updated;
        });
        setNotification(`✅ Cantidad aumentada: ${productoReal.nombre_producto} (${productoReal.cantidad} unidades)`);
      } else {
        // Agregar nuevo producto con datos reales
        setProductos(prev => [...prev, productoReal]);
        setNotification(`✅ Producto agregado: ${productoReal.nombre_producto} (${productoReal.cantidad} unidades)`);
      }
    } catch (error) {
      console.error('Error buscando producto:', error);
      setError(`❌ Producto no encontrado: ${codigo}`);
    } finally {
      setIsBuscandoProducto(false);
    }
    
    setTimeout(() => setNotification(null), 2000);
  };



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
      
      // Agregar producto directamente al carrito
      agregarProductoDirecto(tempProducto.codigo_producto);
      
      // Limpiar el campo inmediatamente para el siguiente escaneo
      setTempProducto({
        codigo_producto: "",
        tipo_item: "producto",
        cantidad: 1,
        cantidad_minima: 0,
      });
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

      if (tipo === "entrada") {
        entradaMultiple(request);
      } else {
        salidaMultiple(request);
      }

      // Limpiar formulario después del envío
      setProductos([]);
      setMotivo("");
      setObservaciones("");
      setNotification(null);
      setSuccess("Movimiento registrado correctamente");
    } catch (err: unknown) {
      console.error("Error:", err);
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err.response as { data?: { error?: string } })?.data?.error || "Error al procesar el movimiento"
        : "Error al procesar el movimiento";
      setError(errorMessage);
    }
  };

  const handleClear = () => {
    setProductos([]);
    setMotivo("");
    setObservaciones("");
    setError(null);
    setSuccess(null);
    setNotification(null);
  };

  const totalProductos = productos.length;
  const totalCantidad = productos.reduce((sum, p) => sum + p.cantidad, 0);
  




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
                Escanea códigos de barras rápidamente. Procesamiento instantáneo.
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
                placeholder={isBuscandoProducto ? "Buscando producto..." : "Ingrese código o escanee"}
                size="small"
                disabled={isBuscandoProducto}
                InputProps={{
                  endAdornment: isBuscandoProducto ? (
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
                disabled={(loadingEntradaMultiple || loadingSalidaMultiple) || productos.length === 0 || !motivo}
                sx={{ 
                  flex: 1,
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                  fontSize: "0.875rem"
                }}
              >
                {(loadingEntradaMultiple || loadingSalidaMultiple) ? <CircularProgress size={16} /> : `Registrar ${tipo}`}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClear}
                disabled={loadingEntradaMultiple || loadingSalidaMultiple}
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