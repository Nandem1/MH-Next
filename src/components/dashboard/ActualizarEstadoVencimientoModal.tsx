"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import { VencimientoEstado, ActualizarEstadoVencimientoRequest } from "@/types/vencimientos";
import { useVencimientosEstados, useStockDisponible } from "@/hooks/useVencimientosEstados";
import { formatCurrency } from "@/utils/formatearRut";

interface ActualizarEstadoVencimientoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  vencimiento: {
    id: number;
    nombre_producto?: string;
    codigo_barras: string;
    cantidad: number;
    precio_actual?: number;
  };
}

const ESTADOS_OPTIONS: { value: VencimientoEstado; label: string; color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" }[] = [
  { value: "pendiente", label: "Pendiente", color: "default" },
  { value: "rebajado", label: "Rebajado", color: "warning" },
  { value: "vendido", label: "Vendido", color: "success" },
];

export function ActualizarEstadoVencimientoModal({
  open,
  onClose,
  onSuccess,
  onError,
  vencimiento,
}: ActualizarEstadoVencimientoModalProps) {
  const { actualizarEstado, isActualizando, errorActualizacion } = useVencimientosEstados();
  const { data: stockData } = useStockDisponible(vencimiento.id);
  
  const stockDisponible = stockData?.data?.stock_disponible || vencimiento.cantidad;
  
  const [formData, setFormData] = useState<{
    estado: VencimientoEstado;
    precio_rebaja: string;
    cantidad_afectada: string;
    motivo: string;
  }>({
    estado: "pendiente",
    precio_rebaja: "",
    cantidad_afectada: vencimiento.cantidad.toString(),
    motivo: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (open) {
      setFormData({
        estado: "pendiente",
        precio_rebaja: "",
        cantidad_afectada: vencimiento.cantidad.toString(),
        motivo: "",
      });
      setErrors({});
    }
  }, [open, vencimiento.cantidad]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.estado) {
      newErrors.estado = "El estado es requerido";
    }

    if (formData.estado === "rebajado" && !formData.precio_rebaja) {
      newErrors.precio_rebaja = "El precio de rebaja es requerido";
    }

    if (formData.estado === "rebajado" && parseFloat(formData.precio_rebaja) <= 0) {
      newErrors.precio_rebaja = "El precio de rebaja debe ser mayor a 0";
    }

    if (!formData.cantidad_afectada || parseFloat(formData.cantidad_afectada) <= 0) {
      newErrors.cantidad_afectada = "La cantidad debe ser mayor a 0";
    }

    if (parseFloat(formData.cantidad_afectada) > stockDisponible) {
      newErrors.cantidad_afectada = `La cantidad no puede ser mayor a ${stockDisponible}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const request: ActualizarEstadoVencimientoRequest = {
      vencimiento_id: vencimiento.id,
      estado: formData.estado,
      precio_rebaja: formData.estado === "rebajado" ? parseFloat(formData.precio_rebaja) : undefined,
      cantidad_afectada: parseFloat(formData.cantidad_afectada),
      motivo: formData.motivo.trim() || undefined,
    };

    actualizarEstado(request, {
      onSuccess: () => {
        // Mostrar notificación de éxito según el estado
        let successMessage = "";
        switch (formData.estado) {
          case "rebajado":
            successMessage = `✅ Rebaja realizada: ${formData.cantidad_afectada} unidades a $${formData.precio_rebaja}`;
            break;
          case "vendido":
            successMessage = `✅ Venta registrada: ${formData.cantidad_afectada} unidades vendidas`;
            break;
          case "pendiente":
            successMessage = `✅ Estado actualizado: ${formData.cantidad_afectada} unidades marcadas como pendientes`;
            break;
          default:
            successMessage = "✅ Estado actualizado correctamente";
        }
        onSuccess?.(successMessage);
        onClose();
      },
      onError: (error) => {
        console.error('❌ [Modal] onError llamado:', error);
        const errorMessage = error?.message || "Error al actualizar el estado";
        onError?.(errorMessage);
      },
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const nombreProducto = vencimiento.nombre_producto || "Sin nombre";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Actualizar Estado de Vencimiento
      </DialogTitle>
      
      <DialogContent>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            {nombreProducto}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Código: {vencimiento.codigo_barras}
          </Typography>
          <Box display="flex" gap={1} mt={1}>
            <Chip 
              label={`Stock: ${stockDisponible}`} 
              size="small" 
              variant="outlined" 
            />
            {vencimiento.precio_actual && (
              <Chip 
                label={`Precio: ${formatCurrency(vencimiento.precio_actual)}`} 
                size="small" 
                variant="outlined" 
              />
            )}
          </Box>
        </Box>

        {errorActualizacion && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorActualizacion.message || "Error al actualizar el estado"}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          {/* Estado */}
          <FormControl fullWidth error={!!errors.estado}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={formData.estado}
              label="Estado"
              onChange={(e) => handleInputChange("estado", e.target.value)}
            >
              {ESTADOS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Chip 
                    label={option.label} 
                    size="small" 
                    color={option.color}
                    sx={{ mr: 1 }}
                  />
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.estado && (
              <Typography variant="caption" color="error">
                {errors.estado}
              </Typography>
            )}
          </FormControl>

          {/* Precio de rebaja (solo si el estado es "rebajado") */}
          {formData.estado === "rebajado" && (
            <TextField
              fullWidth
              label="Precio de Rebaja"
              type="number"
              value={formData.precio_rebaja}
              onChange={(e) => handleInputChange("precio_rebaja", e.target.value)}
              error={!!errors.precio_rebaja}
              helperText={errors.precio_rebaja}
              InputProps={{
                startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>,
              }}
            />
          )}

          {/* Cantidad afectada */}
          <TextField
            fullWidth
            label="Cantidad Afectada"
            type="number"
            value={formData.cantidad_afectada}
            onChange={(e) => handleInputChange("cantidad_afectada", e.target.value)}
            error={!!errors.cantidad_afectada}
            helperText={errors.cantidad_afectada || `Máximo: ${stockDisponible}`}
            inputProps={{
              min: 1,
              max: stockDisponible,
            }}
          />

          {/* Motivo */}
          <TextField
            fullWidth
            label="Motivo (opcional)"
            multiline
            rows={3}
            value={formData.motivo}
            onChange={(e) => handleInputChange("motivo", e.target.value)}
            placeholder="Agregar comentarios sobre el cambio de estado..."
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isActualizando}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isActualizando}
          startIcon={isActualizando ? <CircularProgress size={16} /> : null}
        >
          {isActualizando ? "Actualizando..." : "Actualizar Estado"}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 