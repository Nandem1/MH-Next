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
import { RindeGastosForm } from "./RindeGastosForm";
import { RindeGastosHistorial } from "./RindeGastosHistorial";
import { EstadisticasCategorias } from "./EstadisticasCategorias";
import { useRindeGastos } from "../../hooks/useRindeGastos";
import { useCajaChica } from "../../hooks/useCajaChica";
import { formatearMonto } from "@/utils/rindeGastosValidation";

// Re-exportar para compatibilidad
export type { Gasto } from "../../services/rindeGastosService";

interface RindeGastosContentProps {
  showSnackbar: (message: string, severity: "success" | "error" | "info" | "warning") => void;
}

export function RindeGastosContent({ showSnackbar }: RindeGastosContentProps) {
  const theme = useTheme();
  
  // Usar el hook profesional para gestión de gastos
  const {
    gastos,
    loadingGastos,
    loadingEstadoCaja,
    errorGastos,
    crearGasto,
    eliminarGasto,
    estadoSistema,
    loadingEliminarGasto,
    loadingCrearGasto,
  } = useRindeGastos({ showSnackbar });

  // Hook para caja chica
  const { reiniciarCicloCompleto, loadingReiniciarCicloCompleto } = useCajaChica({ showSnackbar });

  // Calcular valores derivados
  const totalGastos = gastos?.reduce((sum, gasto) => sum + parseFloat(gasto.monto), 0) || 0;
  const saldoActual = estadoSistema?.saldoActual || 0; // Saldo real del endpoint /caja-chica/estado
  const loading = loadingGastos || loadingEstadoCaja;
  const error = errorGastos?.message;

  if (loading && (!gastos || gastos.length === 0)) {
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
          {error}
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
          startIcon={loadingReiniciarCicloCompleto ? <CircularProgress size={20} sx={{ color: "inherit" }} /> : <RefreshIcon />}
          onClick={reiniciarCicloCompleto}
          disabled={loadingReiniciarCicloCompleto}
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
          {loadingReiniciarCicloCompleto ? "Reiniciando..." : "Reiniciar Ciclo"}
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
          <EstadisticasCategorias />
        </Grid>
      </Grid>

      {/* Contenido principal */}
      <Grid container spacing={4} sx={{ flex: 1 }}>
                 <Grid size={{ xs: 12, lg: 5 }}>
           <RindeGastosForm 
             onAgregarGasto={async (gastoData) => {
               crearGasto({
                 descripcion: gastoData.descripcion,
                 monto: gastoData.monto,
                 fecha: gastoData.fecha,
                 categoria: gastoData.categoria,
                 cuenta_contable_id: gastoData.cuenta_contable_id,
                 observaciones: gastoData.observaciones,
                 comprobante_url: gastoData.comprobante_url,
               });
             }}
             saldoDisponible={saldoActual}
             loading={loadingCrearGasto}
           />
         </Grid>

                 <Grid size={{ xs: 12, lg: 7 }}>
           <RindeGastosHistorial 
             gastos={gastos || []}
             onEliminarGasto={eliminarGasto}
             formatearMonto={formatearMonto}
             loadingEliminarGasto={loadingEliminarGasto}
           />
         </Grid>
      </Grid>
    </Box>
  );
}
