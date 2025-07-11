"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  LocalOffer as LocalOfferIcon,
  Schedule as ScheduleIcon,
  Label as LabelIcon,
} from "@mui/icons-material";
import { ControlVencimientosSearchBar } from "./ControlVencimientosSearchBar";
import { ControlVencimientosTable } from "./ControlVencimientosTable";
import { useControlVencimientos } from "@/hooks/useControlVencimientos";
import { useEstadisticasEstadosVencimientos } from "@/hooks/useVencimientosEstados";

export function ControlVencimientosPageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("");
  
  const {
    data: vencimientosData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useControlVencimientos();

  const {
    data: estadisticasData,
  } = useEstadisticasEstadosVencimientos();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleOriginFilter = (origin: string) => {
    setSelectedOrigin(origin);
  };

  const filteredData = vencimientosData?.data?.filter((item) => {
    const matchesSearch = searchTerm === "" || 
      item.nombre_producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo_barras?.includes(searchTerm) ||
      item.codigo_producto?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "" || 
      item.categoria_nombre === selectedCategory;
    
    const matchesOrigin = selectedOrigin === "" || 
      item.origen === selectedOrigin;

    return matchesSearch && matchesCategory && matchesOrigin;
  }) || [];

  // Función para calcular días hasta vencimiento
  const getDaysUntilExpiry = (fechaVencimiento: string) => {
    const today = new Date();
    const expiryDate = new Date(fechaVencimiento);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error al cargar los datos de vencimientos: {error.message}
      </Alert>
    );
  }

  // Calcular estadísticas básicas desde los datos
  const totalVencimientos = vencimientosData?.total || 0;
  
  // Obtener estadísticas de estados desde el nuevo endpoint
  const estadisticasEstados = estadisticasData?.data || [];
  const rebajado = estadisticasEstados.find(item => item.estado === 'rebajado')?.cantidad_productos_unicos || '0';
  
  // Calcular productos por vencer (que vencen en 7 días o menos)
  const porVencer = vencimientosData?.data?.filter(item => {
    const daysUntilExpiry = getDaysUntilExpiry(item.fecha_vencimiento);
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
  }).length || 0;
  
  // Obtener categorías únicas
  const categorias = [...new Set(vencimientosData?.data?.map(item => item.categoria_nombre).filter(Boolean) || [])];
  
  // Obtener orígenes únicos
  const origenes = [...new Set(vencimientosData?.data?.map(item => item.origen) || [])];

  return (
    <Box>
      {/* Estadísticas */}
      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Vencimientos
                  </Typography>
                  <Typography variant="h4" component="div">
                    {totalVencimientos}
                  </Typography>
                </Box>
                <InventoryIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Rebajado
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    {rebajado}
                  </Typography>
                </Box>
                <LocalOfferIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Por Vencer
                  </Typography>
                  <Typography variant="h4" component="div" color="warning.main">
                    {porVencer}
                  </Typography>
                </Box>
                <ScheduleIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Categorías
                  </Typography>
                  <Typography variant="h4" component="div">
                    {categorias.length}
                  </Typography>
                </Box>
                <LabelIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros y búsqueda */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <ControlVencimientosSearchBar
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          onOriginFilter={handleOriginFilter}
          categories={categorias}
          origins={origenes}
        />
      </Paper>

      {/* Tabla de datos */}
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <ControlVencimientosTable 
          data={filteredData}
          onRefresh={refetch}
          isRefetching={isRefetching}
        />
      </Paper>
    </Box>
  );
} 