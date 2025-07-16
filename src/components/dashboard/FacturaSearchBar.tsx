"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
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
  onGestionCheques?: () => void;
}

// Lista estática de locales
const locales = [
  { id: "LA CANTERA 3055", nombre: "LA CANTERA 3055" },
  { id: "LIBERTADOR 1476", nombre: "LIBERTADOR 1476" },
  { id: "BALMACEDA 599", nombre: "BALMACEDA 599" },
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
        p: 3,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: isSmall ? "column" : "row", gap: 2, alignItems: "stretch", flexWrap: "wrap" }}>
        <TextField
          label="Buscar por Folio"
          variant="outlined"
          value={folio}
          onChange={(e) => setFolio(e.target.value)}
          fullWidth={isSmall}
          size="small"
          placeholder="Ingrese el folio de la factura"
        />

        <Autocomplete
          disablePortal
          options={proveedores || []}
          getOptionLabel={(option) => option.nombre}
          value={selectedProveedor}
          onChange={handleProveedorChange}
          loading={isLoadingProveedores}
          fullWidth={isSmall}
          size="small"
          sx={{ minWidth: isSmall ? "100%" : 200 }}
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
          size="small"
          sx={{ minWidth: isSmall ? "100%" : 200 }}
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
          size="small"
          sx={{ minWidth: isSmall ? "100%" : 200 }}
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
          onClick={handleSubmit}
          startIcon={<SearchIcon />}
          sx={{ textTransform: "none", minWidth: isSmall ? "100%" : "auto" }}
        >
          Buscar
        </Button>

        <Button
          variant="outlined"
          onClick={handleClear}
          startIcon={<ClearIcon />}
          sx={{ textTransform: "none", minWidth: isSmall ? "100%" : "auto" }}
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
    </Box>
  );
}