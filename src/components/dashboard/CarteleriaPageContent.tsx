"use client";

import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Chip,
  Grid,
} from "@mui/material";
import { useCarteleria } from "@/hooks/useCarteleria";
import { CarteleriaSearchBar } from "./CarteleriaSearchBar";
import { CarteleriaCard } from "./CarteleriaCard";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export function CarteleriaPageContent() {
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    searchTerm,
    setSearchTerm,
    filterTipo,
    setFilterTipo,
    filterDiscrepancia,
    setFilterDiscrepancia,
    tiposUnicos,
    estadisticas,
  } = useCarteleria();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <AlertTitle>Error</AlertTitle>
        Error al cargar los datos de auditoría de cartelería. Por favor, inténtalo de nuevo.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Título y estadísticas */}
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Auditoría de Cartelería
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Revisa y compara los precios de cartelería con los precios de lista actuales
        </Typography>
      </Box>

      {/* Estadísticas */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumen
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip
            icon={<CheckCircleIcon />}
            label={`Total: ${estadisticas.total}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<CheckCircleIcon />}
            label={`Coinciden: ${estadisticas.coinciden}`}
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<WarningIcon />}
            label={`Con Discrepancia: ${estadisticas.conDiscrepancia}`}
            color="warning"
            variant="outlined"
          />
          <Chip
            label={`${estadisticas.porcentajeDiscrepancia}% con discrepancia`}
            color={estadisticas.conDiscrepancia > 0 ? "error" : "success"}
            variant="filled"
          />
        </Box>
      </Paper>

      {/* Barra de búsqueda */}
      <CarteleriaSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterTipo={filterTipo}
        setFilterTipo={setFilterTipo}
        filterDiscrepancia={filterDiscrepancia}
        setFilterDiscrepancia={setFilterDiscrepancia}
        tiposUnicos={tiposUnicos}
        onRefresh={refetch}
        isRefetching={isRefetching}
      />

      {/* Resultados */}
      <Box>
        {data.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontraron resultados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || filterTipo || filterDiscrepancia
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay datos de cartelería disponibles"}
            </Typography>
          </Paper>
        ) : (
          <>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Mostrando {data.length} resultado{data.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              {data.map((item) => (
                <Grid size={{ xs: 12, md: 6 }} key={item.carteleria.carteleria_id}>
                  <CarteleriaCard item={item} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
} 