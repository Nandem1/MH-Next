"use client";

import { useState, useEffect } from "react";
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
} from "@mui/material";
import { format } from "date-fns";
import { Gasto } from "../../services/rindeGastosService";
import { CuentaContable } from "../../services/cuentasContablesService";
import { useCuentasContables } from "../../hooks/useCuentasContables";

interface RindeGastosFormProps {
  onAgregarGasto: (gasto: Omit<Gasto, "id" | "fechaCreacion" | "estado">) => Promise<void>;
  saldoDisponible: number;
}

// Las categorías ahora se cargan dinámicamente desde el servicio

export function RindeGastosForm({ onAgregarGasto, saldoDisponible }: RindeGastosFormProps) {
  const theme = useTheme();
  
  // Estado del formulario
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState<number | "">("");
  const [fecha, setFecha] = useState<Date>(new Date());
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaContable | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Hook para cuentas contables
  const {
    cuentas: cuentasContables,
    cuentasMasUsadas,
    loading: loadingCuentas,
    error: errorCuentas,
    registrarUso,
  } = useCuentasContables();

  // Limpiar errores de cuentas cuando cambie el error principal
  useEffect(() => {
    if (errorCuentas && !error) {
      setError(errorCuentas);
    }
  }, [errorCuentas, error]);

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
    if (typeof monto === "number" && monto > saldoDisponible && saldoDisponible >= 0) {
      setError("El monto excede el saldo disponible");
      return false;
    }
    if (!fecha) {
      setError("La fecha es obligatoria");
      return false;
    }
    if (!cuentaSeleccionada) {
      setError("Debe seleccionar una cuenta contable");
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
      // Crear el gasto
      await onAgregarGasto({
        descripcion: descripcion.trim(),
        monto: Number(monto),
        fecha,
        categoria: cuentaSeleccionada?.nombre || "Sin categoría",
        cuentaContableId: cuentaSeleccionada?.id,
      });
      
      // Registrar el uso de la cuenta seleccionada
      if (cuentaSeleccionada) {
        await registrarUso(cuentaSeleccionada.id);
      }

      // Limpiar formulario
      setDescripcion("");
      setMonto("");
      setFecha(new Date());
      setCuentaSeleccionada(null);
      
    } catch (error) {
      setError("Error al registrar el gasto" + error);
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

            {/* Monto y Categoría */}
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

            <Grid size={12}>
              {/* Cuentas más utilizadas */}
              {cuentasMasUsadas.length > 0 && (
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
                loading={loadingCuentas}
                options={cuentasContables}
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
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
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
                )}
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
                {loading ? "Guardando..." : "Guardar Gasto"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
}
