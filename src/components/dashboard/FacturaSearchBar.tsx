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
  Chip,
  Stack,
  Paper,
  Typography,
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

  // Encontrar los valores seleccionados para mostrar en los Autocomplete
  const selectedUsuario = usuarios?.find(u => u.id.toString() === usuarioActual) || null;
  const selectedProveedor = proveedores?.find(p => p.id.toString() === proveedorActual) || null;
  const selectedLocal = locales.find(l => l.id === localActual) || null;

  // Verificar si hay filtros activos
  const hasActiveFilters = folio.trim() || localActual || usuarioActual || proveedorActual;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: 3,
        bgcolor: "background.paper",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "12px",
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary", mb: 3 }}>
        Filtros
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: isSmall ? "column" : "row",
          gap: 2,
          alignItems: "stretch",
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Buscar por Folio"
          variant="outlined"
          value={folio}
          onChange={(e) => setFolio(e.target.value)}
          fullWidth={isSmall}
          size="small"
          placeholder="Ingrese el folio de la factura"
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              color: theme.palette.text.primary,
              "& fieldset": {
                borderColor: theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.text.primary,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.text.secondary,
              "&.Mui-focused": {
                color: theme.palette.primary.main,
              },
            },
            input: {
              color: theme.palette.text.primary,
            },
          }}
          InputProps={{
            style: { color: theme.palette.text.primary },
          }}
          InputLabelProps={{
            style: { color: theme.palette.text.secondary },
          }}
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
          sx={{ 
            minWidth: isSmall ? "100%" : 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              color: theme.palette.text.primary,
              "& fieldset": {
                borderColor: theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.text.primary,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.text.secondary,
              "&.Mui-focused": {
                color: theme.palette.primary.main,
              },
            },
          }}
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
          sx={{ 
            minWidth: isSmall ? "100%" : 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              color: theme.palette.text.primary,
              "& fieldset": {
                borderColor: theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.text.primary,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.text.secondary,
              "&.Mui-focused": {
                color: theme.palette.primary.main,
              },
            },
          }}
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
          sx={{ 
            minWidth: isSmall ? "100%" : 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              color: theme.palette.text.primary,
              "& fieldset": {
                borderColor: theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.text.primary,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.text.secondary,
              "&.Mui-focused": {
                color: theme.palette.primary.main,
              },
            },
          }}
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

        <Stack direction="row" spacing={2} sx={{ minWidth: isSmall ? "100%" : "auto" }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<SearchIcon />}
            sx={{ 
              textTransform: "none", 
              borderRadius: "8px",
              px: 3,
              py: 1,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Buscar
          </Button>

          <Button
            variant="outlined"
            onClick={handleClear}
            startIcon={<ClearIcon />}
            sx={{ 
              textTransform: "none", 
              borderRadius: "8px",
              px: 3,
              py: 1,
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              "&:hover": {
                borderColor: theme.palette.text.primary,
                bgcolor: theme.palette.action.hover,
              },
            }}
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
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                <AccountBalanceIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Box>

      {/* Mostrar filtros activos */}
      {hasActiveFilters && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
          {folio && (
            <Chip
              label={`Folio: ${folio}`}
              size="small"
              onDelete={() => {
                setFolio("");
                onSearch("", localActual, usuarioActual, proveedorActual);
              }}
              sx={{
                bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            />
          )}
          {selectedLocal && (
            <Chip
              label={`Local: ${selectedLocal.nombre}`}
              size="small"
              onDelete={() => {
                onLocalChange("");
                onSearch(folio, "", usuarioActual, proveedorActual);
              }}
              sx={{
                bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            />
          )}
          {selectedUsuario && (
            <Chip
              label={`Usuario: ${selectedUsuario.nombre}`}
              size="small"
              onDelete={() => {
                onUsuarioChange("");
                onSearch(folio, localActual, "", proveedorActual);
              }}
              sx={{
                bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            />
          )}
          {selectedProveedor && (
            <Chip
              label={`Proveedor: ${selectedProveedor.nombre}`}
              size="small"
              onDelete={() => {
                onProveedorChange("");
                onSearch(folio, localActual, usuarioActual, "");
              }}
              sx={{
                bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            />
          )}
        </Stack>
      )}
    </Paper>
  );
}