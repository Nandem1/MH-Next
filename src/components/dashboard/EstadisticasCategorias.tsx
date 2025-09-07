"use client";

import {
  Box,
  Typography,
  Paper,
  useTheme,
  Skeleton,
  Grid,
} from "@mui/material";
import { EstadisticasCategoria } from "../../services/gastosService";
import { formatearMonto } from "@/utils/rindeGastosValidation";

interface EstadisticasCategoriasProps {
  estadisticas: EstadisticasCategoria[];
  loading: boolean;
  error?: string | null;
}

export function EstadisticasCategorias({ estadisticas, loading, error }: EstadisticasCategoriasProps) {
  const theme = useTheme();
  
  // Obtener las estadísticas del backend
  const estadisticasData = estadisticas || [];

  const formatearNombreCuenta = (nombre: string) => {
    // Formatear nombre para display más limpio
    return nombre.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const totalGastoGlobal = estadisticasData.reduce((sum, stat) => sum + parseFloat(stat.totalGasto), 0);

  // Manejar estados de carga y error
  if (loading) {
    return (
      <Box>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.primary,
            mb: 3
          }}
        >
          📊 Estadísticas por Cuenta Contable
        </Typography>
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3,
                  border: 1, 
                  borderColor: "divider",
                  borderRadius: 2,
                  textAlign: "center",
                  height: "100%"
                }}
              >
                <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1, mx: "auto" }} />
                <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1, mx: "auto" }} />
                <Skeleton variant="rectangular" width={60} height={3} sx={{ mx: "auto", borderRadius: 1.5 }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.primary,
            mb: 3
          }}
        >
          📊 Estadísticas por Cuenta Contable
        </Typography>
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
          <Typography variant="body2" color="error.main">
            Error al cargar estadísticas
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography 
        variant="h6" 
        component="h2" 
        sx={{ 
          fontWeight: 600, 
          color: theme.palette.text.primary,
          mb: 3
        }}
      >
        Estadísticas por Cuenta
      </Typography>

      {totalGastoGlobal === 0 ? (
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
          <Typography variant="body2" color="text.secondary">
            Sin gastos registrados
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {estadisticasData
            .filter(stat => parseFloat(stat.totalGasto) > 0)
            .sort((a, b) => parseFloat(b.totalGasto) - parseFloat(a.totalGasto))
            .slice(0, 6) // Top 6 categorías más utilizadas
            .map((stat) => {
              const totalGastoNum = parseFloat(stat.totalGasto);
              const porcentajeGasto = parseFloat(stat.porcentaje);

              return (
                <Grid key={`${stat.categoria}-${stat.cuenta_contable_id}`} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3,
                      border: 1, 
                      borderColor: "divider",
                      borderRadius: 2,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1,
                        fontSize: "0.875rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {formatearNombreCuenta(stat.cuenta_contable_nombre)}
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 1
                      }}
                    >
                      {formatearMonto(totalGastoNum)}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 3,
                          backgroundColor: "action.hover",
                          borderRadius: 1.5,
                          overflow: "hidden"
                        }}
                      >
                        <Box
                          sx={{
                            width: `${Math.min(porcentajeGasto, 100)}%`,
                            height: "100%",
                            backgroundColor: theme.palette.primary.main,
                            transition: "width 0.3s ease"
                          }}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          fontWeight: 500
                        }}
                      >
                        {stat.cantidadGastos} gastos • {porcentajeGasto.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
        </Grid>
      )}
    </Box>
  );
}
