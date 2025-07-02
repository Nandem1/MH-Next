"use client";

import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useProveedores } from "@/hooks/useProveedores";

interface FacturaSearchBarProps {
  onSearch: (folio: string, local: string, usuario: string, proveedor: string) => void;
  onClear: () => void;
  onLocalChange: (local: string) => void;
  onUsuarioChange: (usuario: string) => void;
  onProveedorChange: (proveedor: string) => void;
  localActual: string;
  usuarioActual: string;
  proveedorActual: string;
}

// Lista estática de locales
const locales = [
  { id: "LA CANTERA", nombre: "La Cantera" },
  { id: "BALMACEDA", nombre: "Balmaceda" },
  { id: "LIBERTADOR", nombre: "Libertador" },
];

export function FacturaSearchBar({
  onSearch,
  onClear,
  onLocalChange,
  onUsuarioChange,
  onProveedorChange,
  localActual,
  usuarioActual,
  proveedorActual,
}: FacturaSearchBarProps) {
  const [folio, setFolio] = useState("");
  const isSmall = useResponsive("(max-width:600px)");
  
  const { data: usuarios, isLoading: isLoadingUsuarios } = useUsuarios();
  const { data: proveedores, isLoading: isLoadingProveedores } = useProveedores();

  const handleLocalChange = (event: React.SyntheticEvent, newValue: { id: string; nombre: string } | null) => {
    const selectedLocal = newValue ? newValue.id : "";
    onLocalChange(selectedLocal);
  };

  const handleUsuarioChange = (event: React.SyntheticEvent, newValue: { id: number; nombre: string } | null) => {
    const selectedUsuario = newValue ? newValue.id.toString() : "";
    onUsuarioChange(selectedUsuario);
  };

  const handleProveedorChange = (event: React.SyntheticEvent, newValue: { id: number; nombre: string } | null) => {
    const selectedProveedor = newValue ? newValue.id.toString() : "";
    onProveedorChange(selectedProveedor);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folio.trim() || localActual || usuarioActual || proveedorActual) {
      onSearch(folio, localActual, usuarioActual, proveedorActual);
    }
  };

  const handleClear = () => {
    setFolio("");
    onClear();
  };

  // Encontrar el usuario seleccionado para mostrar en el Autocomplete
  const selectedUsuario = usuarios?.find(u => u.id.toString() === usuarioActual) || null;
  
  // Encontrar el proveedor seleccionado para mostrar en el Autocomplete
  const selectedProveedor = proveedores?.find(p => p.id.toString() === proveedorActual) || null;
  
  // Encontrar el local seleccionado para mostrar en el Autocomplete
  const selectedLocal = locales.find(l => l.id === localActual) || null;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: isSmall ? "column" : "row",
        gap: 2,
        mb: 1,
        flexWrap: "wrap",
        alignItems: "stretch",
        justifyContent: "flex-start",
      }}
    >
      <TextField
        label="Buscar por Folio"
        variant="outlined"
        value={folio}
        onChange={(e) => setFolio(e.target.value)}
        fullWidth={isSmall}
      />

      <Autocomplete
        disablePortal
        options={proveedores || []}
        getOptionLabel={(option) => option.nombre}
        value={selectedProveedor}
        onChange={handleProveedorChange}
        loading={isLoadingProveedores}
        fullWidth={isSmall}
        sx={{ minWidth: isSmall ? "100%" : 250 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Proveedor"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoadingProveedores ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        noOptionsText="No se encontraron proveedores"
        loadingText="Cargando proveedores..."
        clearOnBlur
        clearOnEscape
      />

      <Autocomplete
        disablePortal
        options={locales}
        getOptionLabel={(option) => option.nombre}
        value={selectedLocal}
        onChange={handleLocalChange}
        fullWidth={isSmall}
        sx={{ minWidth: isSmall ? "100%" : 250 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Local"
          />
        )}
        noOptionsText="No se encontraron locales"
        clearOnBlur
        clearOnEscape
      />

      <Autocomplete
        disablePortal
        options={usuarios || []}
        getOptionLabel={(option) => option.nombre}
        value={selectedUsuario}
        onChange={handleUsuarioChange}
        loading={isLoadingUsuarios}
        fullWidth={isSmall}
        sx={{ minWidth: isSmall ? "100%" : 250 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Usuario"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoadingUsuarios ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        noOptionsText="No se encontraron usuarios"
        loadingText="Cargando usuarios..."
        clearOnBlur
        clearOnEscape
      />

      <Button
        variant="contained"
        color="warning"
        type="submit"
        fullWidth={isSmall}
      >
        Buscar
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClear}
        fullWidth={isSmall}
      >
        Limpiar
      </Button>
    </Box>
  );
}