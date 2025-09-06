"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  useTheme,
  Autocomplete,
  Chip,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { useGastos } from '../../hooks/useGastos';
import { useCajaChicaNew } from '../../hooks/useCajaChicaNew';
import { useCuentasContables } from '../../hooks/useCuentasContables';
import { CuentaContable } from '../../services/cuentasContablesService';
import { useLocales } from '../../hooks/useLocales';
import { useAuth } from '../../hooks/useAuth';
import { useCajaChicaAuth } from '../../hooks/useCajaChicaAuth';

interface GastoFormNewProps {
  onGastoCreado?: (gasto: unknown) => void;
}

export const GastoFormNew: React.FC<GastoFormNewProps> = ({ onGastoCreado }) => {
  const theme = useTheme();
  const { } = useAuth();
  
  // Estado del formulario
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState<number | "">("");
  const [fecha, setFecha] = useState<Date>(new Date());
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaContable | null>(null);
  const [localSeleccionado, setLocalSeleccionado] = useState<{id: number; nombre: string} | null>(null);
  const [observaciones, setObservaciones] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Hooks
  const { crearGasto } = useGastos();
  const { estado: estadoCajaChica } = useCajaChicaNew();
  const { cuentas, cuentasMasUsadas, loading: loadingCuentas } = useCuentasContables();
  const { locales, loading: loadingLocales } = useLocales();
  const { autorizacion, errorAutorizacion } = useCajaChicaAuth();

  // Verificar autorización
  if (!autorizacion?.tieneCajaChica || errorAutorizacion) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          border: 1, 
          borderColor: "divider",
          borderRadius: 2,
          height: "fit-content",
          p: 4
        }}
      >
        <Alert severity="warning">
          <Typography variant="h6" gutterBottom>
            No tienes autorización para manejar caja chica
          </Typography>
          <Typography variant="body2">
            {errorAutorizacion 
              ? "No se pudo verificar tu autorización. Contacta al administrador para obtener permisos de caja chica."
              : "Contacta al administrador para obtener permisos de caja chica."
            }
          </Typography>
        </Alert>
      </Paper>
    );
  }

  // Loading state
  if (loadingCuentas || loadingLocales) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          border: 1, 
          borderColor: "divider",
          borderRadius: 2,
          height: "fit-content",
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Cargando datos...
        </Typography>
      </Paper>
    );
  }

  // Validaciones
  const validarFormulario = () => {
    if (!descripcion.trim()) {
      setError("La descripción es obligatoria");
      return false;
    }
    
    if (!monto || monto <= 0) {
      setError("El monto debe ser mayor a 0");
      return false;
    }
    if (typeof monto === "number" && monto > 10000000) {
      setError("El monto no puede exceder $10.000.000");
      return false;
    }
    
    if (!fecha) {
      setError("La fecha es obligatoria");
      return false;
    }
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    if (fecha > hoy) {
      setError("La fecha no puede ser futura");
      return false;
    }
    
    if (!cuentaSeleccionada) {
      setError("Debe seleccionar una cuenta contable");
      return false;
    }
    
    if (!localSeleccionado) {
      setError("Debe seleccionar un local para asignar el gasto");
      return false;
    }
    
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    
    try {
      const gastoData = {
        descripcion: descripcion.trim().toUpperCase(),
        monto: Number(monto),
        fecha: format(fecha, "yyyy-MM-dd"),
        categoria: cuentaSeleccionada?.categoria || "GASTOS_OPERACIONALES",
        cuenta_contable_id: cuentaSeleccionada?.id || "",
        local_asignado_id: localSeleccionado?.id || 0,
        observaciones: observaciones ? observaciones.trim().toUpperCase() : "",
      };

      const nuevoGasto = await crearGasto(gastoData);
      
      // Limpiar formulario
      setDescripcion("");
      setMonto("");
      setFecha(new Date());
      setCuentaSeleccionada(null);
      setLocalSeleccionado(null);
      setObservaciones("");
      
      // Callback
      if (onGastoCreado) {
        onGastoCreado(nuevoGasto);
      }
      
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: { code?: string; message?: string } } } };
      if (axiosError?.response?.data?.error?.code === "INSUFFICIENT_BALANCE") {
        setError("Saldo insuficiente para crear el gasto");
      } else if (axiosError?.response?.data?.error?.code === "VALIDATION_ERROR") {
        setError("Datos inválidos: " + axiosError.response?.data?.error?.message);
      } else if (axiosError?.response?.data?.error?.code === "FORBIDDEN") {
        setError("No tienes autorización para crear gastos");
      } else if (axiosError?.response?.data?.error?.code === "NOT_FOUND") {
        setError("El local especificado no existe");
      } else {
        setError("Error al registrar el gasto: " + ((error as Error)?.message || "Error desconocido"));
      }
    } finally {
      setLoading(false);
    }
  };

  // Formatear monto
  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(monto);
  };

  const saldoDisponible = estadoCajaChica?.usuario?.montoActual ? parseFloat(estadoCajaChica.usuario.montoActual) : 0;

  return (
    <Paper 
      elevation={0}
      sx={{ 
        border: 1, 
        borderColor: "divider",
        borderRadius: 2,
        height: "fit-content"
      }}
    >
      <Box sx={{ p: 4 }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.primary,
            mb: 3
          }}
        >
          Nuevo Gasto
        </Typography>

        {/* Alerta de saldo */}
        {saldoDisponible < 0 && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            Saldo insuficiente: {formatearMonto(saldoDisponible)}
          </Alert>
        )}
        
        {saldoDisponible >= 0 && saldoDisponible < 100000 && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            Saldo bajo: {formatearMonto(saldoDisponible)}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Descripción */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                placeholder="Describe el gasto..."
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            </Grid>

            {/* Monto */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Monto"
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value === "" ? "" : Number(e.target.value))}
                required
                inputProps={{ min: 0, step: 1 }}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            </Grid>

            {/* Local Asignado - Mapeo: 1=LA CANTERA 3055, 2=LIBERTADOR 1476, 3=BALMACEDA 599 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                fullWidth
                size="small"
                options={locales || []}
                value={localSeleccionado}
                onChange={(_, newValue) => setLocalSeleccionado(newValue)}
                getOptionLabel={(option) => option.nombre}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Local Asignado"
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps}>
                      <Typography variant="body2">
                        {option.nombre}
                      </Typography>
                    </Box>
                  );
                }}
              />
            </Grid>

            <Grid size={12}>
              {/* Cuentas más utilizadas */}
              {cuentasMasUsadas && cuentasMasUsadas.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Más utilizadas:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {cuentasMasUsadas.map((cuenta) => (
                      <Chip
                        key={cuenta.id}
                        label={cuenta.nombre}
                        variant={cuentaSeleccionada?.id === cuenta.id ? "filled" : "outlined"}
                        onClick={() => setCuentaSeleccionada(cuenta)}
                        sx={{
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          height: 28,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {/* Selector de cuenta contable */}
              <Autocomplete
                fullWidth
                size="small"
                options={cuentas || []}
                value={cuentaSeleccionada}
                onChange={(_, newValue) => setCuentaSeleccionada(newValue)}
                getOptionLabel={(option) => option.nombre}
                groupBy={(option) => option.categoria || 'OTROS'}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cuenta Contable"
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Typography variant="body2">
                          {option.nombre}
                        </Typography>
                        {option.esMasUtilizada && (
                          <Chip
                            label="Frecuente"
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </Box>
                  );
                }}
                renderGroup={(params) => (
                  <Box key={params.key}>
                    <Typography
                      variant="overline"
                      sx={{
                        display: 'block',
                        px: 2,
                        py: 1,
                        fontWeight: 600,
                        color: 'text.secondary',
                        backgroundColor: 'action.hover',
                      }}
                    >
                      {params.group.replace('_', ' ')}
                    </Typography>
                    {params.children}
                  </Box>
                )}
                sx={{
                  "& .MuiAutocomplete-listbox": {
                    maxHeight: 300,
                  },
                }}
              />
            </Grid>

            {/* Fecha */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Fecha"
                type="date"
                value={format(fecha, "yyyy-MM-dd")}
                onChange={(e) => setFecha(new Date(e.target.value))}
                required
                variant="outlined"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            </Grid>


            {/* Observaciones */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Observaciones"
                multiline
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            </Grid>

            {/* Error */}
            {error && (
              <Grid size={12}>
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
              </Grid>
            )}

            {/* Botón de envío */}
            <Grid size={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.2,
                  borderRadius: 1.5,
                  fontWeight: 500,
                  textTransform: "none",
                  backgroundColor: theme.palette.text.primary,
                  color: theme.palette.background.default,
                  "&:hover": {
                    backgroundColor: theme.palette.text.secondary,
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: "inherit" }} />
                    Guardando...
                  </Box>
                ) : (
                  "Guardar Gasto"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};
