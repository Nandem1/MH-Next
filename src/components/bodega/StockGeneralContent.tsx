"use client";

import { useState, useMemo } from "react";
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
  Card,
  CardContent,
  Grid,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { useStock } from "@/hooks/useStock";

export function StockGeneralContent() {
  const theme = useTheme();
  const { usuario } = useAuth();
  const { 
    stockLocalCompleto, 
    loadingStockLocalCompleto, 
    errorStockLocalCompleto, 
    refetchStockLocalCompleto
  } = useStock(usuario?.id_local || 1);

  const [searchTerm, setSearchTerm] = useState("");

  // Función para obtener el estado del stock
  const getStockStatus = (producto: { cantidad_actual: number; cantidad_minima: number }) => {
    const ratio = producto.cantidad_actual / (producto.cantidad_minima || 1);
    if (ratio <= 0.5) return { status: 'critico', color: 'error', label: 'Crítico' };
    if (ratio <= 1) return { status: 'bajo', color: 'warning', label: 'Bajo' };
    return { status: 'normal', color: 'success', label: 'Normal' };
  };

  // Filtrar y ordenar stock basado en búsqueda usando useMemo
  const filteredStock = useMemo(() => {
    if (stockLocalCompleto?.data && Array.isArray(stockLocalCompleto.data)) {
      const filtered = stockLocalCompleto.data.filter(producto =>
        producto.codigo_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.codigo_barra_interno.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Ordenar por estado: Normal → Bajo → Crítico
      return filtered.sort((a, b) => {
        const statusA = getStockStatus(a);
        const statusB = getStockStatus(b);
        
        const priorityOrder = { 'normal': 1, 'bajo': 2, 'critico': 3 };
        const priorityA = priorityOrder[statusA.status as keyof typeof priorityOrder] || 0;
        const priorityB = priorityOrder[statusB.status as keyof typeof priorityOrder] || 0;
        
        return priorityA - priorityB;
      });
    }
    return [];
  }, [stockLocalCompleto, searchTerm]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (!stockLocalCompleto?.data) return {
      totalProductos: 0,
      productosStockBajo: 0,
      valorTotalEstimado: 0,
      movimientosRecientes: 0
    };

    const productos = stockLocalCompleto.data;
    const productosStockBajo = productos.filter(p => 
      p.cantidad_actual <= p.cantidad_minima
    ).length;

    const valorTotalEstimado = productos.reduce((total, p) => 
      total + (p.cantidad_actual * p.precio), 0
    );

    return {
      totalProductos: productos.length,
      productosStockBajo,
      valorTotalEstimado,
      movimientosRecientes: 0 // No disponible en esta API
    };
  }, [stockLocalCompleto]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const handleRefresh = () => {
    refetchStockLocalCompleto();
  };

  if (errorStockLocalCompleto) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error al cargar el stock: {errorStockLocalCompleto.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 600,
              fontSize: "1.25rem",
              mb: 0.5,
              color: "text.primary"
            }}
          >
            Inventario
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ fontSize: "0.875rem" }}
          >
            {stats.totalProductos} productos en stock
          </Typography>
        </Box>
        
        <IconButton 
          onClick={handleRefresh}
          disabled={loadingStockLocalCompleto}
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

      {/* Estadísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ 
            border: 1, 
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper"
          }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                    {formatNumber(stats.totalProductos)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    Productos
                  </Typography>
                </Box>
                <InventoryIcon sx={{ color: "primary.main", fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ 
            border: 1, 
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper"
          }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "warning.main" }}>
                    {formatNumber(stats.productosStockBajo)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    Stock Bajo
                  </Typography>
                </Box>
                <WarningIcon sx={{ color: "warning.main", fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ 
            border: 1, 
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper"
          }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "success.main" }}>
                    ${formatNumber(stats.valorTotalEstimado)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    Valor Total
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ color: "success.main", fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ 
            border: 1, 
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper"
          }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "info.main" }}>
                    {formatNumber(stats.movimientosRecientes)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    Movimientos
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ color: "info.main", fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Búsqueda */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar por código o nombre de producto..."
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
      </Box>

      {/* Tabla de Stock */}
      <Paper 
        elevation={0} 
        sx={{ 
          border: 1, 
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
            Productos ({filteredStock.length})
          </Typography>
        </Box>

        {loadingStockLocalCompleto ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4, flex: 1 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ flex: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
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
                    Stock Actual
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 600, 
                    fontSize: "0.75rem", 
                    py: 1.5,
                    color: theme.palette.text.primary
                  }}>
                    Mínimo
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 600, 
                    fontSize: "0.75rem", 
                    py: 1.5,
                    color: theme.palette.text.primary
                  }}>
                    Estado
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 600, 
                    fontSize: "0.75rem", 
                    py: 1.5,
                    color: theme.palette.text.primary
                  }}>
                    Tipo
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStock.map((producto) => {
                  const status = getStockStatus(producto);
                  return (
                    <TableRow key={producto.codigo_producto} hover>
                      <TableCell sx={{ 
                        fontSize: "0.75rem", 
                        py: 1.5,
                        color: theme.palette.text.primary
                      }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.75rem" }}>
                            {producto.nombre_producto || 'Producto'}
                          </Typography>
                          {producto.codigo_barra_interno && (
                            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.625rem" }}>
                              {producto.codigo_barra_interno}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        fontSize: "0.75rem", 
                        py: 1.5,
                        color: theme.palette.text.primary
                      }}>
                        {producto.codigo_producto}
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        fontSize: "0.75rem", 
                        py: 1.5,
                        color: theme.palette.text.primary,
                        fontWeight: 600
                      }}>
                        {formatNumber(producto.cantidad_actual)}
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        fontSize: "0.75rem", 
                        py: 1.5,
                        color: theme.palette.text.primary
                      }}>
                        {formatNumber(producto.cantidad_minima)}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        <Chip
                          label={status.label}
                          color={status.color as 'success' | 'warning' | 'error'}
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
                        color: theme.palette.text.primary
                      }}>
                        <Chip
                          label={producto.tipo_item === 'pack' ? 'Pack' : 'Producto'}
                          variant="outlined"
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {filteredStock.length === 0 && !loadingStockLocalCompleto && (
          <Box sx={{ p: 4, textAlign: "center", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? "No se encontraron productos con ese criterio de búsqueda" : "No hay productos en el inventario"}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
} 