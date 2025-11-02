"use client";

import { Box, Typography, ToggleButton, ToggleButtonGroup, Chip, Skeleton, useTheme } from "@mui/material";
import { AnimatedPaper } from "@/components/ui/animated";
import { formatearMontoPesos } from "@/utils/formatearMonto";
import { EstadisticasNominasGastos, EstadisticasActivas } from "@/types/nominasGastos";
import { useAnimations } from "@/hooks/useAnimations";

interface EstadisticasSectionProps {
  tipoEstadisticas: 'historicas' | 'activas';
  onTipoEstadisticasChange: (tipo: 'historicas' | 'activas') => void;
  loading: boolean;
  loadingEstadisticas: boolean;
  estadisticas: EstadisticasNominasGastos | null;
  estadisticasActivas: EstadisticasActivas | null;
  filtersAnimation: ReturnType<typeof useAnimations>;
}

export function EstadisticasSection({
  tipoEstadisticas,
  onTipoEstadisticasChange,
  loading,
  loadingEstadisticas,
  estadisticas,
  estadisticasActivas,
  filtersAnimation,
}: EstadisticasSectionProps) {
  const theme = useTheme();

  // Determinar si debemos mostrar skeleton o datos
  const mostrarSkeleton = loading || loadingEstadisticas;
  
  // Calcular altura mínima considerando ambos tipos de estadísticas
  // Usamos la altura máxima posible para evitar saltos al cambiar entre tipos
  const tieneLocalesHistoricos = estadisticas?.top_locales && estadisticas.top_locales.length > 0;
  const tieneLocalesActivos = estadisticasActivas?.por_local && estadisticasActivas.por_local.length > 0;
  const tieneLocales = tieneLocalesHistoricos || tieneLocalesActivos;
  
  // Altura mínima: ~140px sin locales, ~200px con locales
  // Usamos altura fija para evitar saltos al cambiar entre tipos
  const minHeight = tieneLocales ? 200 : 140;

  return (
    <>
      {/* Selector de Tipo de Estadísticas - Minimalista */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <ToggleButtonGroup
          value={tipoEstadisticas}
          exclusive
          onChange={(_, value) => value && onTipoEstadisticasChange(value)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              border: `1px solid ${theme.palette.divider}`,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              px: 2,
              py: 0.75,
              '&.Mui-selected': {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                }
              }
            }
          }}
        >
          <ToggleButton value="historicas">
            Históricas
          </ToggleButton>
          <ToggleButton value="activas">
            Activas
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Contenedor único con altura fija para evitar saltos */}
      <AnimatedPaper
        {...filtersAnimation}
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderRadius: "8px",
          border: `1px solid ${theme.palette.divider}`,
          p: 2.5,
          minHeight: minHeight, // Altura mínima para evitar saltos
        }}
      >
        {/* Skeleton Loading */}
        {mostrarSkeleton ? (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={32} />
              </Box>
            ))}
          </Box>
        ) : (
          <>
            {/* Estadísticas Históricas */}
            {tipoEstadisticas === 'historicas' && estadisticas && (
              <>
                {/* Métricas principales */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem", display: "block", mb: 0.5 }}>
                      Total Gastado
                    </Typography>
                    <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, fontSize: "1.1rem" }}>
                      {formatearMontoPesos(estadisticas.total_gastado)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem", display: "block", mb: 0.5 }}>
                      Total Gastos
                    </Typography>
                    <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, fontSize: "1.1rem" }}>
                      {estadisticas.total_gastos}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem", display: "block", mb: 0.5 }}>
                      Promedio
                    </Typography>
                    <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, fontSize: "1.1rem" }}>
                      {formatearMontoPesos(estadisticas.promedio_gasto)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem", display: "block", mb: 0.5 }}>
                      Período
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500, fontSize: "0.875rem" }}>
                      {new Date(estadisticas.primera_fecha).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })} - {new Date(estadisticas.ultima_fecha).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Locales - Compacto */}
                {estadisticas.top_locales && estadisticas.top_locales.length > 0 && (
                  <Box sx={{ mt: 2.5, pt: 2.5, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {estadisticas.top_locales.map((local) => (
                        <Chip
                          key={local.local_id}
                          label={`${local.nombre_local}: ${formatearMontoPesos(local.total_gastado)}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "0.75rem",
                            height: 24,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}

            {/* Estadísticas Activas */}
            {tipoEstadisticas === 'activas' && estadisticasActivas && (
              <>
                {/* Métricas principales */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem", display: "block", mb: 0.5 }}>
                      Total Gastado
                    </Typography>
                    <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, fontSize: "1.1rem" }}>
                      {formatearMontoPesos(estadisticasActivas.resumen.monto_total_utilizado)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem", display: "block", mb: 0.5 }}>
                      Total Gastos
                    </Typography>
                    <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, fontSize: "1.1rem" }}>
                      {estadisticasActivas.resumen.total_gastos_registrados}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem", display: "block", mb: 0.5 }}>
                      Promedio
                    </Typography>
                    <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, fontSize: "1.1rem" }}>
                      {formatearMontoPesos(estadisticasActivas.resumen.promedio_por_rendicion)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem", display: "block", mb: 0.5 }}>
                      Período
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500, fontSize: "0.875rem" }}>
                      {(() => {
                        // Calcular rango de fechas desde las rendiciones activas
                        const fechas = estadisticasActivas.por_local.flatMap(local => 
                          local.rendiciones.map(r => new Date(r.fecha_inicio))
                        );
                        if (fechas.length > 0) {
                          const primeraFecha = new Date(Math.min(...fechas.map(d => d.getTime())));
                          const ultimaFecha = new Date(Math.max(...fechas.map(d => d.getTime())));
                          return `${primeraFecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })} - ${ultimaFecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })}`;
                        }
                        return 'Activo';
                      })()}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Locales - Compacto */}
                {estadisticasActivas.por_local && estadisticasActivas.por_local.length > 0 && (
                  <Box sx={{ mt: 2.5, pt: 2.5, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {estadisticasActivas.por_local.map((local) => (
                        <Chip
                          key={local.local_id}
                          label={`${local.nombre_local}: ${formatearMontoPesos(local.monto_total_utilizado)}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "0.75rem",
                            height: 24,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </AnimatedPaper>
    </>
  );
}

