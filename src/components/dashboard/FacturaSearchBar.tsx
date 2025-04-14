"use client";

import { Box, TextField, Button, Select, MenuItem } from "@mui/material";
import { useState } from "react";

interface FacturaSearchBarProps {
  onSearch: (folio: string, local: string) => void;
  onClear: () => void;
}

export function FacturaSearchBar({ onSearch, onClear }: FacturaSearchBarProps) {
  const [folio, setFolio] = useState("");
  const [local, setLocal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(folio, local);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
      <TextField
        label="Buscar por Folio"
        variant="outlined"
        value={folio}
        onChange={(e) => setFolio(e.target.value)}
      />

      <Select
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        displayEmpty
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">Todos los Locales</MenuItem>
        <MenuItem value="LA CANTERA">La Cantera</MenuItem>
        <MenuItem value="BALMACEDA">Balmaceda</MenuItem>
        <MenuItem value="LIBERTADOR">Libertador</MenuItem>
        {/* Agrega aquí todos tus locales */}
      </Select>

      <Button variant="contained" color="warning" type="submit">
        Buscar
      </Button>

      <Button variant="outlined" color="secondary" onClick={onClear}>
        Limpiar
      </Button>
    </Box>
  );
}
