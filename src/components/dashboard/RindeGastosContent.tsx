"use client";

import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  Alert,
  CircularProgress,
} from "@mui/material";
import { RindeGastosForm } from "./RindeGastosForm";
import { RindeGastosHistorial } from "./RindeGastosHistorial";
import { EstadisticasCategorias } from "./EstadisticasCategorias";
import { useRindeGastos } from "../../hooks/useRindeGastos";

// Re-exportar para compatibilidad
export type { Gasto } from "../../services/rindeGastosService";

export function RindeGastosContent() {
  const theme = useTheme();
  
  // Usar el hook personalizado para gestión de gastos
  const {
    gastos,
    loading,
    error,
    totalGastos,
    saldoActual,
    agregarGasto,
    eliminarGasto,
    limpiarError,
    formatearMonto,
  } = useRindeGastos({
    fondoFijoInicial: 1000000, // $1,000,000 CLP
    autoLoad: true
  });

  if (loading && gastos.length === 0) {
    return (
      <Box sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
          Cargando sistema de rinde gastos...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Error global */}
      {error && (
        <Alert 
          severity="error" 
          onClose={limpiarError}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}
      {/* Header minimalista */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.primary,
            mb: 1
          }}
        >
          Rinde Gastos
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.text.secondary
          }}
        >
          Gestiona y controla los gastos de caja chica
        </Typography>
      </Box>

      {/* Métricas minimalistas */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3,
              border: 1, 
              borderColor: "divider",
              borderRadius: 2,
              textAlign: "center"
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Saldo Actual
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: saldoActual >= 0 
                  ? theme.palette.success.main 
                  : theme.palette.error.main
              }}
            >
              {formatearMonto(saldoActual)}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3,
              border: 1, 
              borderColor: "divider",
              borderRadius: 2,
              textAlign: "center"
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Total Gastado
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              {formatearMonto(totalGastos)}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3,
              border: 1, 
              borderColor: "divider",
              borderRadius: 2,
              textAlign: "center"
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Gastos
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              {gastos.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Estadísticas por categoría */}
      <Grid container sx={{ mb: 6 }}>
        <Grid size={12}>
          <EstadisticasCategorias />
        </Grid>
      </Grid>

      {/* Contenido principal */}
      <Grid container spacing={4} sx={{ flex: 1 }}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <RindeGastosForm 
            onAgregarGasto={agregarGasto}
            saldoDisponible={saldoActual}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <RindeGastosHistorial 
            gastos={gastos}
            onEliminarGasto={eliminarGasto}
            formatearMonto={formatearMonto}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
