"use client";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  AlertTitle,
  CircularProgress,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AddIcon from "@mui/icons-material/Add";
import { useVencimientosForm } from "@/hooks/useVencimientosForm";
import { BarcodeScanner } from "./BarcodeScanner";
import { VencimientoFormData } from "@/types/vencimientos";
import { useProducto } from "@/hooks/useProducto";
import { ProductoInfo } from "./ProductoInfo";

export function VencimientosPageContent() {
  const [openScanner, setOpenScanner] = useState(false);
  const {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    success,
    resetForm,
  } = useVencimientosForm();

  const {
    producto,
    isLoading: isLoadingProducto,
    error: errorProducto,
    setCodigoBarras,
    limpiarProducto,
  } = useProducto();

  // Monitorear cambios en el código de barras
  useEffect(() => {
    // Sincronizar con la búsqueda de productos
    setCodigoBarras(formData.codigo_barras);
  }, [formData.codigo_barras, setCodigoBarras]);

  const handleScanSuccess = (result: string) => {
    // Actualizar directamente el estado del formulario
    setFormData((prev: VencimientoFormData) => ({
      ...prev,
      codigo_barras: result
    }));
    
    setOpenScanner(false);
  };

  const handleScanError = (error: string) => {
    console.error("Error scanning barcode:", error);
    setOpenScanner(false);
  };

  const handleLimpiar = () => {
    resetForm();
    limpiarProducto();
  };

  return (
    <Box>
      {/* Título */}
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Ingresar Vencimientos
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Captura fechas de vencimiento para productos usando códigos de barras
        </Typography>
      </Box>

      {/* Información del Producto - Mobile: arriba */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
        <ProductoInfo 
          producto={producto}
          isLoading={isLoadingProducto}
          error={errorProducto}
        />
      </Box>

      {/* Alertas */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <AlertTitle>Éxito</AlertTitle>
          Vencimiento registrado correctamente. El formulario se ha limpiado para un nuevo registro.
        </Alert>
      )}

      {/* Formulario */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Nuevo Vencimiento
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Código de Barras */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  label="Código de Barras"
                  name="codigo_barras"
                  value={formData.codigo_barras}
                  onChange={handleInputChange}
                  required
                  placeholder="Escanea o ingresa el código de barras"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setOpenScanner(true)}
                        edge="end"
                        color="primary"
                      >
                        <QrCodeScannerIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            </Grid>

            {/* Fecha de Vencimiento */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Fecha de Vencimiento"
                name="fecha_vencimiento"
                type="date"
                value={formData.fecha_vencimiento}
                onChange={handleInputChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Cantidad */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Cantidad"
                name="cantidad"
                type="number"
                value={formData.cantidad}
                onChange={handleInputChange}
                placeholder="1"
                inputProps={{ min: 1 }}
                helperText="Cantidad de unidades (opcional, por defecto 1)"
              />
            </Grid>

            {/* Lote */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Lote"
                name="lote"
                value={formData.lote}
                onChange={handleInputChange}
                placeholder="Número de lote (opcional)"
                helperText="Identificador del lote (opcional)"
              />
            </Grid>

            {/* Botones */}
            <Grid size={{ xs: 12 }}>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={isLoading}
                  sx={{ minWidth: 150 }}
                >
                  {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Registrar Vencimiento"
                  )}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleLimpiar}
                  disabled={isLoading}
                >
                  Limpiar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Información del Producto - Desktop: después del formulario, Mobile: antes */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <ProductoInfo 
          producto={producto}
          isLoading={isLoadingProducto}
          error={errorProducto}
        />
      </Box>

      {/* Información */}
      <Paper elevation={1} sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Información
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body2" color="text.secondary">
            • <strong>Código de Barras:</strong> Escanea o ingresa manualmente el código del producto
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • <strong>Fecha de Vencimiento:</strong> Fecha límite de consumo del producto
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • <strong>Cantidad:</strong> Número de unidades con esta fecha de vencimiento (opcional)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • <strong>Lote:</strong> Identificador específico del lote (opcional)
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Alert severity="info" sx={{ mt: 1 }}>
            <Typography variant="body2">
              <strong>Nota:</strong> No se pueden registrar vencimientos duplicados para el mismo código de barras, 
              fecha de vencimiento y lote. Sin embargo, un producto puede tener múltiples fechas de vencimiento diferentes.
            </Typography>
          </Alert>
        </Box>
      </Paper>

      {/* Diálogo del Escáner */}
      <Dialog
        open={openScanner}
        onClose={() => setOpenScanner(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Escanear Código de Barras
        </DialogTitle>
        <DialogContent>
          <BarcodeScanner
            onSuccess={handleScanSuccess}
            onError={handleScanError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScanner(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 