"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
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
  onGestionCheques?: () => void;
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
  onGestionCheques,
}: FacturaSearchBarProps) {
  const theme = useTheme();
  const [folio, setFolio] = useState("");
  
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

  const handleSearch = () => {
    onSearch(folio, localActual, usuarioActual, proveedorActual);
  };

  const handleClear = () => {
    setFolio("");
    onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Encontrar el usuario seleccionado para mostrar en el Autocomplete
  const selectedUsuario = usuarios?.find(u => u.id.toString() === usuarioActual) || null;
  
  // Encontrar el proveedor seleccionado para mostrar en el Autocomplete
  const selectedProveedor = proveedores?.find(p => p.id.toString() === proveedorActual) || null;
  
  // Encontrar el local seleccionado para mostrar en el Autocomplete
  const selectedLocal = locales.find(l => l.id === localActual) || null;

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Stack spacing={2}>
        {/* Primera fila: Búsqueda por folio */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="Buscar por folio"
            value={folio}
            onChange={(e) => setFolio(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ingrese el folio de la factura"
            sx={{ flexGrow: 1 }}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{ textTransform: "none" }}
          >
            Buscar
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
            startIcon={<ClearIcon />}
            sx={{ textTransform: "none" }}
          >
            Limpiar
          </Button>
          {onGestionCheques && (
            <Tooltip title="Gestión de Cheques">
              <IconButton
                onClick={onGestionCheques}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                <AccountBalanceIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Segunda fila: Filtros dinámicos */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Autocomplete
            disablePortal
            options={proveedores || []}
            getOptionLabel={(option) => option.nombre}
            value={selectedProveedor}
            onChange={handleProveedorChange}
            loading={isLoadingProveedores}
            size="small"
            sx={{ minWidth: 200 }}
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
            size="small"
            sx={{ minWidth: 200 }}
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
            size="small"
            sx={{ minWidth: 200 }}
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
        </Box>
      </Stack>
    </Box>
  );
}