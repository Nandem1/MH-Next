"use client";

import { useState, useRef } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
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
import { useSnackbar } from "@/hooks/useSnackbar";
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
  const { open: snackbarOpen, message, severity, showSnackbar, handleClose: handleSnackbarClose } = useSnackbar();
  const [productos, setProductos] = useState<StockProducto[]>([]);
  const [motivo, setMotivo] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [showScanner, setShowScanner] = useState(false);

  // Referencia al input para mantener el foco
  const inputRef = useRef<HTMLInputElement>(null);
  // Producto temporal para agregar
  const [tempProducto, setTempProducto] = useState<StockProducto>({
    codigo_producto: "",
    tipo_item: "producto",
    cantidad: 1,
    cantidad_minima: 0,
  });

  const motivos = tipo === "entrada" ? MOTIVOS_ENTRADA : MOTIVOS_SALIDA;

  // Sistema de procesamiento en segundo plano
  const [procesandoEscaneos, setProcesandoEscaneos] = useState<Set<string>>(new Set());
  // Buffer de eventos para capturar escaneos ultra-rápidos (técnica POS profesional)
  const eventBufferRef = useRef<string[]>([]);
  const processingRef = useRef(false);

  // Solo enfocar cuando se hace click en el input (modo POS manual)
  const handleInputClick = () => {
    inputRef.current?.focus();
  };

  // Técnica POS profesional: Buffer de eventos con procesamiento inmediato
  const procesarBuffer = async () => {
    if (processingRef.current || eventBufferRef.current.length === 0) {
      return;
    }
    
    processingRef.current = true;
    
    while (eventBufferRef.current.length > 0) {
      const codigo = eventBufferRef.current.shift()!;
      
      // Si ya está procesando este código, ignorar
      if (procesandoEscaneos.has(codigo)) {
        continue;
      }
      
      // Marcar como procesando
      setProcesandoEscaneos(prev => new Set(prev).add(codigo));
      
             try {
         // Backend ultra-rápido: 0.49ms promedio
         const productoReal = await stockService.getProductoByBarcode(codigo);
         
         // Usar patrón funcional para acceder al estado actual
         setProductos(prev => {
           // Verificar si ya existe en el carrito
           const existingIndex = prev.findIndex(p => p.codigo_producto === productoReal.codigo_producto);
           
           if (existingIndex >= 0) {
             // Sumar cantidad
             const updated = [...prev];
             const cantidadAnterior = updated[existingIndex].cantidad;
             updated[existingIndex] = {
               ...updated[existingIndex],
               cantidad: cantidadAnterior + productoReal.cantidad
             };
             showSnackbar(`✅ Cantidad aumentada: ${productoReal.nombre_producto} (${productoReal.cantidad} unidades)`, "success");
             return updated;
           } else {
             // Agregar nuevo producto con datos reales
             showSnackbar(`✅ Producto agregado: ${productoReal.nombre_producto} (${productoReal.cantidad} unidades)`, "success");
             return [...prev, productoReal];
           }
         });
      } catch (error) {
        console.error('Error buscando producto:', error);
        showSnackbar(`❌ Producto no encontrado: ${codigo}`, "error");
      } finally {
        // Remover de procesando
        setProcesandoEscaneos(prev => {
          const newSet = new Set(prev);
          newSet.delete(codigo);
          return newSet;
        });
      }
      
      // Pausa mínima entre procesamientos
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    processingRef.current = false;
  };

  // Flujo POS ultra-optimizado - procesamiento en segundo plano
  const agregarProductoDirecto = async (codigo: string) => {
    // Agregar al buffer inmediatamente
    eventBufferRef.current.push(codigo);
    
    // Procesar buffer en segundo plano
    procesarBuffer();
  };

  const handleScanSuccess = (result: string) => {
    setTempProducto({ ...tempProducto, codigo_producto: result });
    setShowScanner(false);
    // Mantener el foco inmediatamente después del escaneo
    inputRef.current?.focus();
  };

  const handleScanError = (error: string) => {
    console.error("Error scanning barcode:", error);
    setShowScanner(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && tempProducto.codigo_producto.trim()) {
      event.preventDefault();
      
      const codigo = tempProducto.codigo_producto.trim();
      
      // Limpiar el campo INMEDIATAMENTE para capturar el siguiente escaneo
      setTempProducto({
        codigo_producto: "",
        tipo_item: "producto",
        cantidad: 1,
        cantidad_minima: 0,
      });
      
      // Mantener el foco inmediatamente
      inputRef.current?.focus();
      
      // Procesar en segundo plano
      agregarProductoDirecto(codigo);
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
      showSnackbar("Usuario no autenticado o sin local asignado", "error");
      return;
    }

    if (productos.length === 0) {
      showSnackbar("Debe agregar al menos un producto", "error");
      return;
    }

    if (!motivo) {
      showSnackbar("Debe seleccionar un motivo", "error");
      return;
    }

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
      showSnackbar("Movimiento registrado correctamente", "success");
    } catch (err: unknown) {
      console.error("Error:", err);
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err.response as { data?: { error?: string } })?.data?.error || "Error al procesar el movimiento"
        : "Error al procesar el movimiento";
      showSnackbar(errorMessage, "error");
    }
  };

  const handleClear = () => {
    setProductos([]);
    setMotivo("");
    setObservaciones("");
    // Limpiar escaneos en procesamiento
    setProcesandoEscaneos(new Set());
    // Limpiar buffer de eventos
    eventBufferRef.current = [];
    processingRef.current = false;
  };

  const totalProductos = productos.length;
  const totalCantidad = productos.reduce((sum, p) => sum + p.cantidad, 0);

  return (
    <Box sx={{ 
      display: "grid", 
      gridTemplateColumns: "1fr 400px", 
      gap: 3,
      height: "100%",
      minHeight: 0
    }}>
      {/* COLUMNA IZQUIERDA - Productos */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column",
        minHeight: 0
      }}>
        {/* Header de Productos */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          mb: 2,
          p: 2,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 1
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
            Productos ({totalProductos})
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {totalCantidad} unidades
            </Typography>
          </Box>
        </Box>

        {/* Tabla de Productos con Scroll */}
        <Box sx={{ 
          flex: 1,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 0
        }}>
          {productos.length > 0 ? (
            <>
              {/* Header de tabla fijo */}
              <Box sx={{ 
                p: 2, 
                borderBottom: 1, 
                borderColor: "divider",
                bgcolor: theme.palette.action.hover,
                flexShrink: 0
              }}>
                <Box sx={{ 
                  display: "grid", 
                  gridTemplateColumns: "minmax(200px, 1fr) 140px 100px 80px",
                  gap: 2,
                  alignItems: "center"
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Producto
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Código
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem", textAlign: "center" }}>
                    Cant.
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem", textAlign: "center" }}>
                    Acción
                  </Typography>
                </Box>
              </Box>

              {/* Lista scrolleable */}
              <Box sx={{ 
                flex: 1, 
                overflow: "auto",
                minHeight: 0
              }}>
                {productos.map((producto, index) => (
                  <Box key={producto.codigo_producto} sx={{ 
                    p: 2, 
                    borderBottom: index < productos.length - 1 ? 1 : 0,
                    borderColor: "divider",
                    "&:hover": { bgcolor: "action.hover" }
                  }}>
                    <Box sx={{ 
                      display: "grid", 
                      gridTemplateColumns: "minmax(200px, 1fr) 140px 100px 80px",
                      gap: 2,
                      alignItems: "center"
                    }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500, 
                          fontSize: "0.875rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {producto.nombre_producto || 'Producto'}
                        </Typography>
                        {producto.tipo_item === "pack" && (
                          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                            Desde pack
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ 
                        fontSize: "0.875rem", 
                        fontFamily: "monospace",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {producto.codigo_producto}
                      </Typography>
                      <TextField
                        type="number"
                        value={producto.cantidad}
                        onChange={(e) => handleUpdateCantidad(producto.codigo_producto, parseInt(e.target.value) || 0)}
                        size="small"
                        sx={{ 
                          "& .MuiOutlinedInput-root": { 
                            borderRadius: 1, 
                            fontSize: "0.875rem",
                            height: 36
                          },
                          "& .MuiOutlinedInput-input": {
                            padding: "8px 12px",
                            textAlign: "center"
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveProducto(producto.codigo_producto)}
                        sx={{ justifySelf: "center" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              height: "200px",
              color: "text.secondary"
            }}>
              <Typography variant="body2">
                No hay productos agregados
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* COLUMNA DERECHA - Controles */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column",
        gap: 2,
        height: "100%"
      }}>
        {/* Scanner Input */}
        <Box sx={{ 
          p: 2, 
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 1
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: "1rem" }}>
            Escanear Producto
          </Typography>

          {/* Información del flujo POS */}
          <Box sx={{ 
            p: 1.5, 
            bgcolor: "info.50", 
            border: 1, 
            borderColor: "info.200",
            borderRadius: 1,
            mb: 2
          }}>
            <Typography variant="body2" sx={{ color: "info.main", fontWeight: 500, mb: 0.5, fontSize: "0.75rem" }}>
              ⚡ POS Profesional
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
              Buffer: {eventBufferRef.current.length} | Procesando: {procesandoEscaneos.size}
            </Typography>
          </Box>

          {/* Input de escaneo */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              label="Código de Producto"
              value={tempProducto.codigo_producto}
              onChange={(e) => setTempProducto({ ...tempProducto, codigo_producto: e.target.value })}
              onKeyPress={handleKeyPress}
              onClick={handleInputClick}
              placeholder={
                eventBufferRef.current.length > 0 || procesandoEscaneos.size > 0
                  ? `Buffer: ${eventBufferRef.current.length} | Procesando: ${procesandoEscaneos.size}`
                  : "Escanea código o ingresa manualmente"
              }
              size="small"
              disabled={false}
              inputRef={inputRef}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (eventBufferRef.current.length > 0 || procesandoEscaneos.size > 0) ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CircularProgress size={16} />
                    <Typography variant="caption" sx={{ color: 'warning.main', fontSize: '0.7rem' }}>
                      {eventBufferRef.current.length + procesandoEscaneos.size}
                    </Typography>
                  </Box>
                ) : undefined,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  fontSize: "0.875rem",
                },
                "& .MuiInputLabel-root": {
                  transition: "none !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  transition: "none !important",
                },
                "& .MuiOutlinedInput-input": {
                  transition: "none !important",
                },
                "& .MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75) !important",
                  color: "text.secondary",
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

        {/* Configuración */}
        <Box sx={{ 
          p: 2, 
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          flex: 1
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: "1rem" }}>
            Configuración
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1, fontSize: "0.875rem" } }}
            />
          </Box>
        </Box>

        {/* Botones de Acción */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          gap: 1
        }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={(loadingEntradaMultiple || loadingSalidaMultiple) || productos.length === 0 || !motivo}
            sx={{ 
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

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}