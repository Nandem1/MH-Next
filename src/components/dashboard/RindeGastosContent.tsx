"use client";

import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { GastoFormNew } from "./GastoFormNew";
import { RindeGastosHistorial } from "./RindeGastosHistorial";
import { EstadisticasCategorias } from "./EstadisticasCategorias";
import { useGastos } from "../../hooks/useGastos";
import { useCajaChicaNew } from "../../hooks/useCajaChicaNew";
import { useCajaChicaAuth } from "../../hooks/useCajaChicaAuth";
import { useEstadisticasGastos } from "../../hooks/useEstadisticasGastos";
import { useReiniciarCiclo } from "../../hooks/useReiniciarCiclo";
import { formatearMonto } from "@/utils/rindeGastosValidation";

// Re-exportar para compatibilidad
export type { Gasto } from "../../services/gastosService";

interface RindeGastosContentProps {
  showSnackbar: (message: string, severity: "success" | "error" | "info" | "warning") => void;
}

export function RindeGastosContent({ showSnackbar }: RindeGastosContentProps) {
  const theme = useTheme();
  
  // Hooks del nuevo sistema
  const { gastos, loading: loadingGastos, error: errorGastos, eliminarGasto } = useGastos();
  const { estado: estadoCajaChicaNew, loading: loadingCajaChicaNew } = useCajaChicaNew();
  const { autorizacion, loadingAutorizacion, errorAutorizacion } = useCajaChicaAuth();
  const { estadisticas, loading: loadingEstadisticas, error: errorEstadisticas } = useEstadisticasGastos();
  const { reiniciarCiclo, loading: loadingReiniciarCiclo } = useReiniciarCiclo();

  // Calcular valores derivados
  const totalGastos = gastos?.reduce((sum, gasto) => sum + parseFloat(gasto.monto.toString()), 0) || 0;
  const saldoActual = estadoCajaChicaNew?.usuario?.montoActual ? parseFloat(estadoCajaChicaNew.usuario.montoActual) : 0;
  const loading = loadingGastos || loadingCajaChicaNew || loadingEstadisticas;
  const error = errorGastos;

  // Mostrar loading mientras verifica autorización
  if (loadingAutorizacion) {
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
          Verificando autorización...
        </Typography>
      </Box>
    );
  }

  // Mostrar mensaje si no tiene autorización o si hay error en la autorización
  if (!autorizacion?.tieneCajaChica || errorAutorizacion) {
    return (
      <Box sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        p: 4
      }}>
        <Alert severity="warning" sx={{ maxWidth: 600, width: "100%" }}>
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
      </Box>
    );
  }

  if (loading) {
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
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {error instanceof Error ? error.message : String(error)}
        </Alert>
      )}
      {/* Header minimalista */}
      <Box sx={{ mb: 6, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
        <Box>
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
        <Button
          variant="contained"
          startIcon={loadingReiniciarCiclo ? <CircularProgress size={20} sx={{ color: "inherit" }} /> : <RefreshIcon />}
          onClick={async () => {
            try {
              await reiniciarCiclo();
              showSnackbar("Ciclo reiniciado exitosamente", "success");
            } catch {
              showSnackbar("Error al reiniciar ciclo", "error");
            }
          }}
          disabled={loadingReiniciarCiclo}
          sx={{
            bgcolor: "text.primary",
            color: "background.paper",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
            py: 1.5,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "text.primary",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            "&:disabled": {
              bgcolor: "action.disabledBackground",
              color: "action.disabled",
            },
          }}
        >
          {loadingReiniciarCiclo ? "Reiniciando..." : "Reiniciar Ciclo"}
        </Button>
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
              {gastos?.length || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Estadísticas por categoría */}
      <Grid container sx={{ mb: 6 }}>
        <Grid size={12}>
          <EstadisticasCategorias 
            estadisticas={estadisticas} 
            loading={loadingEstadisticas} 
            error={errorEstadisticas instanceof Error ? errorEstadisticas.message : errorEstadisticas} 
          />
        </Grid>
      </Grid>

      {/* Contenido principal */}
      <Grid container spacing={4} sx={{ flex: 1 }}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <GastoFormNew 
            onGastoCreado={async () => {
              showSnackbar("Gasto creado exitosamente", "success");
              // React Query se encarga automáticamente de actualizar la UI
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <RindeGastosHistorial 
            gastos={gastos || []}
            onEliminarGasto={async (id) => {
              try {
                await eliminarGasto(id);
                showSnackbar("Gasto eliminado exitosamente", "success");
                // React Query se encarga automáticamente de actualizar la UI
              } catch {
                showSnackbar("Error al eliminar gasto", "error");
              }
            }}
            formatearMonto={formatearMonto}
            loadingEliminarGasto={loadingGastos}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
