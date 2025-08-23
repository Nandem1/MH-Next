"use client";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { 
  Delete,
  TrendingDown 
} from "@mui/icons-material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Gasto } from "./RindeGastosContent";

interface RindeGastosHistorialProps {
  gastos: Gasto[];
  onEliminarGasto: (id: string) => void;
  formatearMonto: (monto: number) => string;
}

// Colores para categorías
const coloresCategorias: Record<string, string> = {
  "Alimentación": "#FF6B6B",
  "Transporte": "#4ECDC4",
  "Oficina": "#45B7D1",
  "Comunicaciones": "#96CEB4",
  "Mantenimiento": "#FFEAA7",
  "Servicios": "#DDA0DD",
  "Otros": "#A8A8A8",
};

export function RindeGastosHistorial({ 
  gastos, 
  onEliminarGasto, 
  formatearMonto 
}: RindeGastosHistorialProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Agrupar gastos por fecha
  const gastosAgrupados = gastos.reduce((grupos, gasto) => {
    const fechaKey = format(gasto.fecha, "yyyy-MM-dd");
    if (!grupos[fechaKey]) {
      grupos[fechaKey] = [];
    }
    grupos[fechaKey].push(gasto);
    return grupos;
  }, {} as Record<string, Gasto[]>);

  // Ordenar fechas de más reciente a más antigua
  const fechasOrdenadas = Object.keys(gastosAgrupados).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        border: 1, 
        borderColor: "divider",
        borderRadius: 2,
        height: "fit-content",
        maxHeight: "calc(100vh - 300px)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Box sx={{ p: 4, pb: 2, flexShrink: 0 }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.primary
          }}
        >
          Historial
        </Typography>
      </Box>

      {/* Lista de gastos con scroll */}
      <Box sx={{ flex: 1, overflow: "auto", px: 4, pb: 4 }}>
        {gastos.length === 0 ? (
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2,
              border: 0,
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[900] 
                : theme.palette.grey[50],
              "& .MuiAlert-message": {
                textAlign: "center",
                width: "100%"
              }
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 2 }}>
              <TrendingDown sx={{ fontSize: 32, opacity: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                No hay gastos registrados
              </Typography>
            </Box>
          </Alert>
        ) : (
          <Box>
            {fechasOrdenadas.map((fecha) => (
              <Box key={fecha} sx={{ mb: 4 }}>
                {/* Header de fecha minimalista */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {format(new Date(fecha), "dd MMM yyyy", { locale: es })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatearMonto(
                      gastosAgrupados[fecha].reduce((sum, g) => sum + g.monto, 0)
                    )} • {gastosAgrupados[fecha].length} gasto{gastosAgrupados[fecha].length !== 1 ? 's' : ''}
                  </Typography>
                </Box>

                {/* Lista de gastos del día */}
                <List sx={{ p: 0 }}>
                  {gastosAgrupados[fecha].map((gasto) => (
                    <ListItem
                      key={gasto.id}
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1.5,
                        mb: 1,
                        py: 2,
                        backgroundColor: theme.palette.background.default,
                        "&:hover": {
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? theme.palette.grey[900] 
                            : theme.palette.grey[50],
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Box>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 500,
                                  color: theme.palette.text.primary,
                                  mb: 0.5
                                }}
                              >
                                {gasto.descripcion}
                              </Typography>
                              <Chip
                                size="small"
                                label={gasto.categoria || "Otros"}
                                sx={{
                                  height: 20,
                                  fontSize: "0.75rem",
                                  backgroundColor: theme.palette.mode === 'dark' 
                                    ? theme.palette.grey[800] 
                                    : theme.palette.grey[200],
                                  color: theme.palette.text.secondary,
                                }}
                              />
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: theme.palette.text.primary,
                                  fontWeight: 600,
                                }}
                              >
                                {formatearMonto(gasto.monto)}
                              </Typography>
                              <IconButton
                                size="small"
                                aria-label="eliminar"
                                onClick={() => onEliminarGasto(gasto.id)}
                                sx={{
                                  color: theme.palette.text.secondary,
                                  "&:hover": {
                                    color: theme.palette.error.main,
                                    backgroundColor: theme.palette.error.main + "10",
                                  },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
