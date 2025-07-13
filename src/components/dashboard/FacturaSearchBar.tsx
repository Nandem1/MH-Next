"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

interface FacturaSearchBarProps {
  onSearch: (folio: string, local: string) => void;
  onClear: () => void;
  onLocalChange: (local: string) => void;
  onUsuarioChange: (usuario: string) => void;
  onProveedorChange: (proveedor: string) => void;
  localActual: string;
  usuarioActual: string;
  proveedorActual: string;
  onGestionCheques?: () => void;
}

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

  const handleSearch = () => {
    onSearch(folio, localActual);
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

        {/* Segunda fila: Filtros */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Local</InputLabel>
            <Select
              value={localActual}
              label="Local"
              onChange={(e) => onLocalChange(e.target.value)}
            >
              <MenuItem value="">Todos los locales</MenuItem>
              <MenuItem value="LA CANTERA">LA CANTERA</MenuItem>
              <MenuItem value="LIBERTADOR">LIBERTADOR</MenuItem>
              <MenuItem value="BALMACEDA">BALMACEDA</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Usuario</InputLabel>
            <Select
              value={usuarioActual}
              label="Usuario"
              onChange={(e) => onUsuarioChange(e.target.value)}
            >
              <MenuItem value="">Todos los usuarios</MenuItem>
              <MenuItem value="1">Usuario 1</MenuItem>
              <MenuItem value="2">Usuario 2</MenuItem>
              <MenuItem value="3">Usuario 3</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Proveedor</InputLabel>
            <Select
              value={proveedorActual}
              label="Proveedor"
              onChange={(e) => onProveedorChange(e.target.value)}
            >
              <MenuItem value="">Todos los proveedores</MenuItem>
              <MenuItem value="1">Proveedor 1</MenuItem>
              <MenuItem value="2">Proveedor 2</MenuItem>
              <MenuItem value="3">Proveedor 3</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Box>
  );
}