"use client";

import {
  Box,
  Typography,
  Paper,
  Grid,
  useTheme,
  LinearProgress,
} from "@mui/material";
import { useRindeGastos } from "../../hooks/useRindeGastos";

interface EstadisticaCategoria {
  categoria: string;
  totalGasto: number;
  cantidadGastos: number;
  porcentaje: number;
}

export function EstadisticasCategorias() {
  const theme = useTheme();
  
  // Usar el hook de gastos para obtener las estadísticas monetarias
  const { obtenerEstadisticasPorCategoria, formatearMonto } = useRindeGastos();
  
  // Obtener las estadísticas calculadas
  const estadisticas = obtenerEstadisticasPorCategoria();

  const formatearCategoria = (categoria: string) => {
    return categoria;
  };

  const obtenerColorCategoria = (categoria: string) => {
    // Asignar colores basados en el nombre de la categoría
    const hash = categoria.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const totalGastoGlobal = estadisticas.reduce((sum, stat) => sum + stat.total, 0);

  // No necesitamos estados de loading o error ya que los datos vienen del hook

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
          Gastos por Categoría
        </Typography>

        {totalGastoGlobal === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Aún no hay gastos registrados.
              <br />
              Las estadísticas aparecerán cuando comiences a agregar gastos.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {estadisticas
              .filter(stat => stat.total > 0)
              .sort((a, b) => b.total - a.total)
              .map((stat) => {
                const porcentajeGasto = totalGastoGlobal > 0 ? (stat.total / totalGastoGlobal) * 100 : 0;

                return (
                  <Grid key={stat.categoria} size={12}>
                    <Box
                      sx={{
                        p: 3,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        backgroundColor: "background.paper",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Barra de fondo para indicar el porcentaje */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          width: `${porcentajeGasto}%`,
                          backgroundColor: obtenerColorCategoria(stat.categoria),
                          opacity: 0.1,
                          transition: "width 0.3s ease",
                        }}
                      />

                      <Box sx={{ position: "relative", zIndex: 1 }}>
                        {/* Header de la categoría */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: obtenerColorCategoria(stat.categoria),
                            }}
                          >
                            {formatearCategoria(stat.categoria)}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {formatearMonto(stat.total)}
                          </Typography>
                        </Box>

                        {/* Métricas detalladas */}
                        <Grid container spacing={2}>
                          <Grid size={6}>
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                % del Total
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={porcentajeGasto}
                                  sx={{
                                    flex: 1,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: "action.hover",
                                    "& .MuiLinearProgress-bar": {
                                      backgroundColor: obtenerColorCategoria(stat.categoria),
                                      borderRadius: 3,
                                    },
                                  }}
                                />
                                <Typography variant="body2" sx={{ minWidth: 45, fontWeight: 600 }}>
                                  {porcentajeGasto.toFixed(1)}%
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={6}>
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Cantidad de Gastos
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                  {stat.cantidad}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  gastos
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
          </Grid>
        )}

        {/* Resumen global */}
        {totalGastoGlobal > 0 && (
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: 1,
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Total gastado: <strong>{formatearMonto(totalGastoGlobal)}</strong>
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
