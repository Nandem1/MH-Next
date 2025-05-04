"use client";

import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";

interface FacturaSearchBarProps {
  onSearch: (folio: string, local: string) => void;
  onClear: () => void;
  onLocalChange: (local: string) => void;
  localActual: string;
}

export function FacturaSearchBar({
  onSearch,
  onClear,
  onLocalChange,
  localActual,
}: FacturaSearchBarProps) {
  const [folio, setFolio] = useState("");
  const isSmall = useMediaQuery("(max-width:600px)");

  const handleLocalChange = (e: SelectChangeEvent<string>) => {
    const selectedLocal = e.target.value;
    onLocalChange(selectedLocal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folio.trim()) {
      onSearch(folio, localActual);
    }
  };

  const handleClear = () => {
    setFolio("");
    onClear();
  };

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

      <Select
        value={localActual}
        onChange={handleLocalChange}
        displayEmpty
        fullWidth={isSmall}
        sx={{ minWidth: isSmall ? "100%" : 200 }}
      >
        <MenuItem value="">Todos los Locales</MenuItem>
        <MenuItem value="LA CANTERA">La Cantera</MenuItem>
        <MenuItem value="BALMACEDA">Balmaceda</MenuItem>
        <MenuItem value="LIBERTADOR">Libertador</MenuItem>
      </Select>

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