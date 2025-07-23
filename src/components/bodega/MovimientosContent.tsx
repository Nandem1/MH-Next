"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { useMovimientos } from "@/hooks/useStock";
import { StockMovimiento } from "@/types/stock";

interface MovimientosContentProps {
  tipo: "todos" | "entrada" | "salida";
}

export function MovimientosContent({ tipo }: MovimientosContentProps) {
  const theme = useTheme();
  const { usuario } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [filteredMovimientos, setFilteredMovimientos] = useState<StockMovimiento[]>([]);

  // Configurar filtros según el tipo
  const filtros: Record<string, unknown> = {
    id_local: usuario?.id_local || 1,
    tipo_movimiento: tipo === "todos" ? undefined : tipo,
    fecha_desde: fechaDesde || undefined,
    fecha_hasta: fechaHasta || undefined,
    limit: 100,
    offset: 0,
  };

  const { 
    movimientos, 
    totalMovimientos,
    isLoading, 
    error, 
    refetch 
  } = useMovimientos(usuario?.id_local || 1, filtros);

  // Filtrar movimientos basado en búsqueda
  useEffect(() => {
    if (movimientos) {
      const filtered = movimientos.filter(movimiento =>
        movimiento.codigo_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (movimiento.nombre_producto && movimiento.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())) ||
        movimiento.motivo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovimientos(filtered);
    }
  }, [movimientos, searchTerm]);

  const getMovimientoColor = (tipo: string) => {
    return tipo === 'entrada' ? 'success' : 'error';
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error al cargar los movimientos: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Filtros */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: "1rem" }}>
          Filtros
        </Typography>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr auto" } }}>
          <TextField
            placeholder="Buscar por producto, código o motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                fontSize: "0.875rem",
              },
            }}
          />

          <TextField
            type="date"
            label="Fecha desde"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                fontSize: "0.875rem",
              },
            }}
          />

          <TextField
            type="date"
            label="Fecha hasta"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                fontSize: "0.875rem",
              },
            }}
          />

          <IconButton 
            onClick={handleRefresh}
            disabled={isLoading}
            sx={{ 
              border: 1, 
              borderColor: "divider",
              borderRadius: 1,
              p: 1.5
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Tabla de Movimientos */}
      <Paper 
        elevation={0} 
        sx={{ 
          border: 1, 
          borderColor: "divider",
          borderRadius: 1.5,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
            Movimientos ({filteredMovimientos.length} de {totalMovimientos})
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    fontSize: "0.75rem", 
                    py: 1.5,
                    color: theme.palette.text.primary
                  }}>
                    Fecha
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    fontSize: "0.75rem", 
                    py: 1.5,
                    color: theme.palette.text.primary
                  }}>
                    Producto
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    fontSize: "0.75rem", 
                    py: 1.5,
                    color: theme.palette.text.primary
                  }}>
                    Código
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 600, 
                    fontSize: "0.75rem", 
                    py: 1.5,
                    color: theme.palette.text.primary
                  }}>
                    Tipo
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 600, 
                    fontSize: "0.75rem", 
                    py: 1.5,
                    color: theme.palette.text.primary
                  }}>
                    Cantidad
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 600, 
                    fontSize: "0.75rem", 
                    py: 1.5,
                    color: theme.palette.text.primary
                  }}>
                    Stock Anterior
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 600, 
                    fontSize: "0.75rem", 
                    py: 1.5,
                    color: theme.palette.text.primary
                  }}>
                    Stock Nuevo
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    fontSize: "0.75rem", 
                    py: 1.5,
                    color: theme.palette.text.primary
                  }}>
                    Motivo
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    fontSize: "0.75rem", 
                    py: 1.5,
                    color: theme.palette.text.primary
                  }}>
                    Usuario
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMovimientos.map((movimiento) => (
                  <TableRow key={movimiento.id} hover>
                                         <TableCell sx={{ 
                       fontSize: "0.75rem", 
                       py: 1.5,
                       color: theme.palette.text.primary
                     }}>
                       {movimiento.created_at ? formatDate(movimiento.created_at) : '-'}
                     </TableCell>
                    <TableCell sx={{ 
                      fontSize: "0.75rem", 
                      py: 1.5,
                      color: theme.palette.text.primary
                    }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.75rem" }}>
                          {movimiento.nombre_producto || 'Producto'}
                        </Typography>
                        <Chip
                          label={movimiento.tipo_item === 'pack' ? 'Pack' : 'Producto'}
                          variant="outlined"
                          size="small"
                          sx={{ 
                            fontSize: "0.625rem",
                            height: 18,
                            mt: 0.5,
                            "& .MuiChip-label": {
                              px: 0.5,
                              fontWeight: 500
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: "0.75rem", 
                      py: 1.5,
                      color: theme.palette.text.primary
                    }}>
                      {movimiento.codigo_producto}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1.5 }}>
                                             <Chip
                         label={movimiento.tipo_movimiento === 'entrada' ? 'Entrada' : 'Salida'}
                         color={getMovimientoColor(movimiento.tipo_movimiento) as 'success' | 'error'}
                         size="small"
                        sx={{ 
                          fontSize: "0.625rem",
                          height: 20,
                          "& .MuiChip-label": {
                            px: 1,
                            fontWeight: 500
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ 
                      fontSize: "0.75rem", 
                      py: 1.5,
                      color: theme.palette.text.primary,
                      fontWeight: 600
                    }}>
                      {formatNumber(movimiento.cantidad)}
                    </TableCell>
                                         <TableCell align="center" sx={{ 
                       fontSize: "0.75rem", 
                       py: 1.5,
                       color: theme.palette.text.primary
                     }}>
                       {movimiento.cantidad_anterior ? formatNumber(movimiento.cantidad_anterior) : '-'}
                     </TableCell>
                     <TableCell align="center" sx={{ 
                       fontSize: "0.75rem", 
                       py: 1.5,
                       color: theme.palette.text.primary,
                       fontWeight: 600
                     }}>
                       {movimiento.cantidad_nueva ? formatNumber(movimiento.cantidad_nueva) : '-'}
                     </TableCell>
                    <TableCell sx={{ 
                      fontSize: "0.75rem", 
                      py: 1.5,
                      color: theme.palette.text.primary
                    }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                          {movimiento.motivo.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </Typography>
                        {movimiento.observaciones && (
                          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.625rem" }}>
                            {movimiento.observaciones}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: "0.75rem", 
                      py: 1.5,
                      color: theme.palette.text.primary
                    }}>
                      {movimiento.nombre_usuario || `Usuario ${movimiento.id_usuario}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {filteredMovimientos.length === 0 && !isLoading && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || fechaDesde || fechaHasta 
                ? "No se encontraron movimientos con esos filtros" 
                : "No hay movimientos registrados"}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
} 