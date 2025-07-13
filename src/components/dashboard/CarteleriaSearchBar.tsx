"use client";

import { Box, TextField, IconButton, Paper, CircularProgress, FormControl, InputLabel, Select, MenuItem, Tooltip } from "@mui/material";



import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClearIcon from "@mui/icons-material/Clear";

interface CarteleriaSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterTipo: string;
  setFilterTipo: (tipo: string) => void;
  filterDiscrepancia: string;
  setFilterDiscrepancia: (discrepancia: string) => void;
  tiposUnicos: string[];
  onRefresh: () => void;
  isRefetching?: boolean;
}

export function CarteleriaSearchBar({
  searchTerm,
  setSearchTerm,
  filterTipo,
  setFilterTipo,
  filterDiscrepancia,
  setFilterDiscrepancia,
  tiposUnicos,
  onRefresh,
  isRefetching = false,
}: CarteleriaSearchBarProps) {
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterTipo("");
    setFilterDiscrepancia("");
  };

  const hasActiveFilters = searchTerm || filterTipo || filterDiscrepancia;

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          size="small"
          placeholder="Buscar por nombre, código o código de barras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
          }}
          sx={{ flex: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Tipo de Cartelería</InputLabel>
          <Select
            value={filterTipo}
            label="Tipo de Cartelería"
            onChange={(e) => setFilterTipo(e.target.value)}
          >
            <MenuItem value="">Todos los tipos</MenuItem>
            {tiposUnicos.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Estado de Precios</InputLabel>
          <Select
            value={filterDiscrepancia}
            label="Estado de Precios"
            onChange={(e) => setFilterDiscrepancia(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="discrepancia">Con Discrepancia</MenuItem>
            <MenuItem value="coincide">Precios Coinciden</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" gap={1}>
          <Tooltip title="Actualizar datos">
            <IconButton 
              onClick={onRefresh} 
              color="primary"
              disabled={isRefetching}
            >
              {isRefetching ? (
                <CircularProgress size={20} />
              ) : (
                <RefreshIcon />
              )}
            </IconButton>
          </Tooltip>
          
          {hasActiveFilters && (
            <Tooltip title="Limpiar filtros">
              <IconButton onClick={handleClearFilters} color="secondary">
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
} 