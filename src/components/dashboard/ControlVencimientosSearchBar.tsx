"use client";

import { Box, TextField, Button, Chip, IconButton, Grid, Tooltip, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

import { useState } from "react";

import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";

interface ControlVencimientosSearchBarProps {
  onSearch: (term: string) => void;
  onCategoryFilter: (category: string) => void;
  onOriginFilter: (origin: string) => void;
  categories: string[];
  origins: string[];
}

export function ControlVencimientosSearchBar({
  onSearch,
  onCategoryFilter,
  onOriginFilter,
  categories,
  origins,
}: ControlVencimientosSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedCategory(value);
    onCategoryFilter(value);
  };

  const handleOriginChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedOrigin(value);
    onOriginFilter(value);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedOrigin("");
    onSearch("");
    onCategoryFilter("");
    onOriginFilter("");
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedOrigin;

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre, código de barras o código de producto..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
              endAdornment: searchTerm && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchTerm("");
                    onSearch("");
                  }}
                >
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box display="flex" gap={1} alignItems="center" justifyContent={{ xs: "flex-start", md: "flex-end" }}>
            <Tooltip title="Mostrar/Ocultar filtros">
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                color={showFilters ? "primary" : "default"}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>

            {hasActiveFilters && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearAll}
                startIcon={<ClearIcon />}
              >
                Limpiar filtros
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {showFilters && (
        <Grid container spacing={2} mt={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={selectedCategory}
                label="Categoría"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">Todas las categorías</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Origen</InputLabel>
              <Select
                value={selectedOrigin}
                label="Origen"
                onChange={handleOriginChange}
              >
                <MenuItem value="">Todos los orígenes</MenuItem>
                {origins.map((origin) => (
                  <MenuItem key={origin} value={origin}>
                    {origin.charAt(0).toUpperCase() + origin.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}

      {hasActiveFilters && (
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          {searchTerm && (
            <Chip
              label={`Búsqueda: "${searchTerm}"`}
              onDelete={() => {
                setSearchTerm("");
                onSearch("");
              }}
              color="primary"
              variant="outlined"
            />
          )}
          {selectedCategory && (
            <Chip
              label={`Categoría: ${selectedCategory}`}
              onDelete={() => {
                setSelectedCategory("");
                onCategoryFilter("");
              }}
              color="secondary"
              variant="outlined"
            />
          )}
          {selectedOrigin && (
            <Chip
              label={`Origen: ${selectedOrigin}`}
              onDelete={() => {
                setSelectedOrigin("");
                onOriginFilter("");
              }}
              color="info"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Box>
  );
} 