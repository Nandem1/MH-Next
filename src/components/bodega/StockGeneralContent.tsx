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
import { StockProducto } from "@/types/stock";

export function StockGeneralContent() {
  const theme = useTheme();
  const { usuario } = useAuth();
  const { 
    stockLocal, 
    stockBajo, 
    loadingStock, 
    loadingStockBajo, 
    errorStock, 
    // errorStockBajo,
    refetchStock,
    refetchStockBajo,
    stats
  } = useStock(usuario?.id_local || 1);

  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar stock basado en búsqueda usando useMemo
  const filteredStock = useMemo(() => {
    if (stockLocal && Array.isArray(stockLocal)) {
      return stockLocal.filter(producto =>
        producto.codigo_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.nombre_producto && producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()))
      ).map(producto => ({
        ...producto,
        cantidad: producto.cantidad_actual || 0,
        tipo_item: (producto.tipo_item === 'producto' || producto.tipo_item === 'pack') 
          ? producto.tipo_item as 'producto' | 'pack' 
          : 'producto' as const
      }));
    }
    return [];
  }, [stockLocal, searchTerm]);

  const getStockStatus = (producto: StockProducto) => {
    const ratio = producto.cantidad / (producto.cantidad_minima || 1);
    if (ratio <= 0.5) return { status: 'critico', color: 'error', label: 'Crítico' };
    if (ratio <= 1) return { status: 'bajo', color: 'warning', label: 'Bajo' };
    return { status: 'normal', color: 'success', label: 'Normal' };
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const handleRefresh = () => {
    refetchStock();
    refetchStockBajo();
  };

  if (errorStock) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error al cargar el stock: {errorStock.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              mb: 0.5,
              color: "text.primary"
            }}
          >
            Stock General
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ fontSize: "0.875rem" }}
          >
            Gestión de inventario y control de stock
          </Typography>
        </Box>
        
        <IconButton 
          onClick={handleRefresh}
          disabled={loadingStock || loadingStockBajo}
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            border: 1, 
            borderColor: "divider",
            borderRadius: 1.5,
            bgcolor: "background.paper"
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                    {formatNumber(stats.totalProductos)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    Total Productos
                  </Typography>
                </Box>
                <InventoryIcon sx={{ color: "primary.main", fontSize: 32 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            border: 1, 
            borderColor: "divider",
            borderRadius: 1.5,
            bgcolor: "background.paper"
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "warning.main" }}>
                    {formatNumber(stats.productosStockBajo)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    Stock Bajo
                  </Typography>
                </Box>
                <WarningIcon sx={{ color: "warning.main", fontSize: 32 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            border: 1, 
            borderColor: "divider",
            borderRadius: 1.5,
            bgcolor: "background.paper"
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "success.main" }}>
                    ${formatNumber(stats.valorTotalEstimado)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    Valor Estimado
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ color: "success.main", fontSize: 32 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            border: 1, 
            borderColor: "divider",
            borderRadius: 1.5,
            bgcolor: "background.paper"
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "info.main" }}>
                    {formatNumber(stats.movimientosRecientes)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    Movimientos
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ color: "info.main", fontSize: 32 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Búsqueda */}
      <Box sx={{ mb: 3 }}>
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
          borderRadius: 1.5,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
            Inventario ({filteredStock.length} productos)
          </Typography>
        </Box>

        {loadingStock ? (
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
                          {producto.codigo_barras && (
                            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.625rem" }}>
                              {producto.codigo_barras}
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

        {filteredStock.length === 0 && !loadingStock && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? "No se encontraron productos con ese criterio de búsqueda" : "No hay productos en el inventario"}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Alertas de Stock Bajo */}
      {stockBajo && stockBajo.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: "1rem" }}>
            ⚠️ Alertas de Stock Bajo ({stockBajo.length})
          </Typography>
          
          <Grid container spacing={2}>
            {stockBajo.slice(0, 6).map((producto) => {
              const productoAdaptado = {
                ...producto,
                cantidad: producto.cantidad_actual || 0,
                tipo_item: (producto.tipo_item === 'producto' || producto.tipo_item === 'pack') 
                  ? producto.tipo_item as 'producto' | 'pack' 
                  : 'producto' as const
              };
              const status = getStockStatus(productoAdaptado);
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={producto.codigo_producto}>
                  <Card sx={{ 
                    border: 1, 
                    borderColor: status.color === 'error' ? 'error.main' : 'warning.main',
                    borderRadius: 1.5,
                    bgcolor: status.color === 'error' ? 'error.50' : 'warning.50'
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                          {producto.nombre_producto || 'Producto'}
                        </Typography>
                        <Chip
                          label={status.label}
                          color={status.color as 'success' | 'warning' | 'error'}
                          size="small"
                          sx={{ 
                            fontSize: "0.625rem",
                            height: 18,
                            "& .MuiChip-label": {
                              px: 0.5,
                              fontWeight: 500
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.625rem" }}>
                        {producto.codigo_producto}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                          Stock: <strong>{producto.cantidad_actual}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                          Mín: <strong>{producto.cantidad_minima}</strong>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
} 