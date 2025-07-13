"use client";

import { Box, TextField, Button, Typography, Paper, Chip, Stack, FormControl, InputLabel, Select, MenuItem, useTheme } from "@mui/material";



import type { FiltroNominas } from "@/types/nominaCheque";
import { useState } from "react";

interface FiltroNominasProps {
  filtro: FiltroNominas;
  onFiltroChange: (filtro: FiltroNominas) => void;
  locales: { id: string; nombre: string }[];
}

export function FiltroNominas({ filtro, onFiltroChange, locales }: FiltroNominasProps) {
  const [localFiltro, setLocalFiltro] = useState<FiltroNominas>(filtro);
  const theme = useTheme();

  const handleApplyFilters = () => {
    onFiltroChange(localFiltro);
  };

  const handleClearFilters = () => {
    const emptyFiltro: FiltroNominas = {};
    setLocalFiltro(emptyFiltro);
    onFiltroChange(emptyFiltro);
  };

  const hasActiveFilters = Object.values(filtro).some(value => value !== undefined && value !== "");

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

      <Stack spacing={3}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Nombre de nómina"
            value={localFiltro.nombre || ""}
            onChange={(e) => setLocalFiltro({ ...localFiltro, nombre: e.target.value })}
            placeholder="Buscar por nombre..."
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

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: theme.palette.text.secondary, "&.Mui-focused": { color: theme.palette.primary.main } }}>Local</InputLabel>
            <Select
              value={localFiltro.local || ""}
              label="Local"
              onChange={(e) => setLocalFiltro({ ...localFiltro, local: e.target.value })}
              sx={{
                borderRadius: "8px",
                color: theme.palette.text.primary,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.divider,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.text.primary,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                },
              }}
            >
              <MenuItem value="">Todos los locales</MenuItem>
              {locales.map((local) => (
                <MenuItem key={local.id} value={local.id} style={{ color: theme.palette.text.primary }}>
                  {local.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: theme.palette.text.secondary, "&.Mui-focused": { color: theme.palette.primary.main } }}>Estado</InputLabel>
            <Select
              value={localFiltro.estado || ""}
              label="Estado"
              onChange={(e) => setLocalFiltro({ ...localFiltro, estado: e.target.value })}
              sx={{
                borderRadius: "8px",
                color: theme.palette.text.primary,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.divider,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.text.primary,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                },
              }}
            >
              <MenuItem value="">Todos los estados</MenuItem>
              <MenuItem value="ACTIVA">Activa</MenuItem>
              <MenuItem value="COMPLETADA">Completada</MenuItem>
              <MenuItem value="CANCELADA">Cancelada</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Fecha desde"
            type="date"
            value={localFiltro.fechaDesde || ""}
            onChange={(e) => setLocalFiltro({ ...localFiltro, fechaDesde: e.target.value })}
            InputLabelProps={{ shrink: true, style: { color: theme.palette.text.secondary } }}
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
          />

          <TextField
            label="Fecha hasta"
            type="date"
            value={localFiltro.fechaHasta || ""}
            onChange={(e) => setLocalFiltro({ ...localFiltro, fechaHasta: e.target.value })}
            InputLabelProps={{ shrink: true, style: { color: theme.palette.text.secondary } }}
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
          />
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <Box>
            {hasActiveFilters && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {filtro.nombre && (
                  <Chip
                    label={`Nombre: ${filtro.nombre}`}
                    size="small"
                    onDelete={() => {
                      const newFiltro = { ...localFiltro, nombre: "" };
                      setLocalFiltro(newFiltro);
                      onFiltroChange(newFiltro);
                    }}
                    sx={{
                      bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      border: `1px solid ${theme.palette.divider}`,
                      "& .MuiChip-deleteIcon": {
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.text.primary,
                        },
                      },
                    }}
                  />
                )}
                {filtro.local && (
                  <Chip
                    label={`Local: ${locales.find(l => l.id === filtro.local)?.nombre || filtro.local}`}
                    size="small"
                    onDelete={() => {
                      const newFiltro = { ...localFiltro, local: "" };
                      setLocalFiltro(newFiltro);
                      onFiltroChange(newFiltro);
                    }}
                    sx={{
                      bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      border: `1px solid ${theme.palette.divider}`,
                      "& .MuiChip-deleteIcon": {
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.text.primary,
                        },
                      },
                    }}
                  />
                )}
                {filtro.estado && (
                  <Chip
                    label={`Estado: ${filtro.estado}`}
                    size="small"
                    onDelete={() => {
                      const newFiltro = { ...localFiltro, estado: "" };
                      setLocalFiltro(newFiltro);
                      onFiltroChange(newFiltro);
                    }}
                    sx={{
                      bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      border: `1px solid ${theme.palette.divider}`,
                      "& .MuiChip-deleteIcon": {
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.text.primary,
                        },
                      },
                    }}
                  />
                )}
                {(filtro.fechaDesde || filtro.fechaHasta) && (
                  <Chip
                    label={`Fechas: ${filtro.fechaDesde || "..."} - ${filtro.fechaHasta || "..."}`}
                    size="small"
                    onDelete={() => {
                      const newFiltro = { ...localFiltro, fechaDesde: "", fechaHasta: "" };
                      setLocalFiltro(newFiltro);
                      onFiltroChange(newFiltro);
                    }}
                    sx={{
                      bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      border: `1px solid ${theme.palette.divider}`,
                      "& .MuiChip-deleteIcon": {
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.text.primary,
                        },
                      },
                    }}
                  />
                )}
              </Stack>
            )}
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              sx={{
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                textTransform: "none",
                fontWeight: 500,
                borderRadius: "8px",
                "&:hover": {
                  borderColor: theme.palette.text.primary,
                  bgcolor: theme.palette.action.hover,
                },
                "&:disabled": {
                  borderColor: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled,
                },
              }}
            >
              Limpiar
            </Button>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === 'light' ? "#000" : "#000",
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                  boxShadow: "none",
                },
              }}
            >
              Aplicar Filtros
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
} 