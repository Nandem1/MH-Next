"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Typography,
  Chip,
  Collapse,
  useTheme,
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { locales } from "@/hooks/useAuthStatus";

interface FiltrosNominasProps {
  filtros: {
    local?: string;
    usuario?: string;
    estado?: string;
    numero_nomina?: string;
    tracking_estado?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
  };
  onAplicarFiltros: (filtros: {
    local?: string;
    usuario?: string;
    estado?: string;
    numero_nomina?: string;
    tracking_estado?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
  }) => void;
  onLimpiarFiltros: () => void;
  loading?: boolean;
}

const estadosNominas = [
  { value: "pendiente", label: "Pendiente" },
  { value: "activo", label: "Activo" },
  { value: "completado", label: "Completado" },
  { value: "cancelado", label: "Cancelado" },
];

const estadosTracking = [
  { value: "EN_ORIGEN", label: "En Origen" },
  { value: "EN_TRANSITO", label: "En Tránsito" },
  { value: "RECIBIDA", label: "Recibida" },
];

export function FiltrosNominas({
  filtros,
  onAplicarFiltros,
  onLimpiarFiltros,
  loading = false,
}: FiltrosNominasProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [filtrosLocales, setFiltrosLocales] = useState({
    local: filtros.local || "",
    usuario: filtros.usuario || "",
    estado: filtros.estado || "",
    numero_nomina: filtros.numero_nomina || "",
    tracking_estado: filtros.tracking_estado || "",
    fecha_desde: filtros.fecha_desde || "",
    fecha_hasta: filtros.fecha_hasta || "",
  });

  const handleAplicarFiltros = () => {
    const filtrosAplicar = {
      ...filtrosLocales,
    };
    
    // Remover campos vacíos
    Object.keys(filtrosAplicar).forEach(key => {
      if (filtrosAplicar[key as keyof typeof filtrosAplicar] === "") {
        delete filtrosAplicar[key as keyof typeof filtrosAplicar];
      }
    });
    
    onAplicarFiltros(filtrosAplicar);
  };

  const handleLimpiarFiltros = () => {
    setFiltrosLocales({
      local: "",
      usuario: "",
      estado: "",
      numero_nomina: "",
      tracking_estado: "",
      fecha_desde: "",
      fecha_hasta: "",
    });
    onLimpiarFiltros();
  };

  const filtrosActivos = Object.values(filtros).filter(valor => valor && valor !== "").length;

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header de filtros */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        mb: 2 
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterListIcon sx={{ color: theme.palette.text.secondary }} />
          <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary" }}>
            Filtros
          </Typography>
          {filtrosActivos > 0 && (
            <Chip
              label={`${filtrosActivos} activo${filtrosActivos > 1 ? 's' : ''}`}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setExpanded(!expanded)}
            startIcon={<FilterListIcon />}
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            {expanded ? "Ocultar" : "Mostrar"} Filtros
          </Button>
          {filtrosActivos > 0 && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleLimpiarFiltros}
              startIcon={<ClearIcon />}
              disabled={loading}
              sx={{
                borderColor: theme.palette.error.light,
                color: theme.palette.error.main,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  borderColor: theme.palette.error.main,
                  bgcolor: theme.palette.error.light,
                  color: theme.palette.error.contrastText,
                },
              }}
            >
              Limpiar
            </Button>
          )}
        </Box>
      </Box>

      {/* Filtros expandibles */}
      <Collapse in={expanded}>
        <Box sx={{ 
          p: 3, 
          bgcolor: "background.default", 
          borderRadius: "12px",
          border: `1px solid ${theme.palette.divider}`,
        }}>
          <Stack spacing={3}>
              {/* Primera fila */}
              <Box sx={{ 
                display: "grid", 
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, 
                gap: 2 
              }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ 
                    color: theme.palette.text.secondary, 
                    "&.Mui-focused": { color: theme.palette.primary.main } 
                  }}>
                    Local
                  </InputLabel>
                  <Select
                    value={filtrosLocales.local}
                    label="Local"
                    onChange={(e) => setFiltrosLocales({ ...filtrosLocales, local: e.target.value })}
                    sx={{
                      borderRadius: "8px",
                      color: theme.palette.text.primary,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.divider,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.text.primary,
                      },
                    }}
                  >
                    <MenuItem value="">Todos los locales</MenuItem>
                    {locales.map((local) => (
                      <MenuItem key={local.id} value={local.id.toString()}>
                        {local.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Usuario"
                  value={filtrosLocales.usuario}
                  onChange={(e) => setFiltrosLocales({ ...filtrosLocales, usuario: e.target.value })}
                  placeholder="Buscar por usuario..."
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      color: theme.palette.text.primary,
                      "& fieldset": {
                        borderColor: theme.palette.divider,
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.text.primary,
                      },
                    },
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel sx={{ 
                    color: theme.palette.text.secondary, 
                    "&.Mui-focused": { color: theme.palette.primary.main } 
                  }}>
                    Estado de Nómina
                  </InputLabel>
                  <Select
                    value={filtrosLocales.estado}
                    label="Estado de Nómina"
                    onChange={(e) => setFiltrosLocales({ ...filtrosLocales, estado: e.target.value })}
                    sx={{
                      borderRadius: "8px",
                      color: theme.palette.text.primary,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.divider,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.text.primary,
                      },
                    }}
                  >
                    <MenuItem value="">Todos los estados</MenuItem>
                    {estadosNominas.map((estado) => (
                      <MenuItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Segunda fila */}
              <Box sx={{ 
                display: "grid", 
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, 
                gap: 2 
              }}>
                <TextField
                  label="Número de Nómina"
                  value={filtrosLocales.numero_nomina}
                  onChange={(e) => setFiltrosLocales({ ...filtrosLocales, numero_nomina: e.target.value })}
                  placeholder="Buscar por número..."
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      color: theme.palette.text.primary,
                      "& fieldset": {
                        borderColor: theme.palette.divider,
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.text.primary,
                      },
                    },
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel sx={{ 
                    color: theme.palette.text.secondary, 
                    "&.Mui-focused": { color: theme.palette.primary.main } 
                  }}>
                    Estado de Tracking
                  </InputLabel>
                  <Select
                    value={filtrosLocales.tracking_estado}
                    label="Estado de Tracking"
                    onChange={(e) => setFiltrosLocales({ ...filtrosLocales, tracking_estado: e.target.value })}
                    sx={{
                      borderRadius: "8px",
                      color: theme.palette.text.primary,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.divider,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.text.primary,
                      },
                    }}
                  >
                    <MenuItem value="">Todos los estados</MenuItem>
                    {estadosTracking.map((estado) => (
                      <MenuItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box /> {/* Espacio vacío para mantener el grid */}
              </Box>

              {/* Tercera fila - Fechas */}
              <Box sx={{ 
                display: "grid", 
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, 
                gap: 2 
              }}>
                <TextField
                  label="Fecha Desde"
                  type="date"
                  value={filtrosLocales.fecha_desde || ""}
                  onChange={(e) => setFiltrosLocales({ ...filtrosLocales, fecha_desde: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      color: theme.palette.text.primary,
                      "& fieldset": {
                        borderColor: theme.palette.divider,
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.text.primary,
                      },
                    },
                  }}
                />

                <TextField
                  label="Fecha Hasta"
                  type="date"
                  value={filtrosLocales.fecha_hasta || ""}
                  onChange={(e) => setFiltrosLocales({ ...filtrosLocales, fecha_hasta: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      color: theme.palette.text.primary,
                      "& fieldset": {
                        borderColor: theme.palette.divider,
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.text.primary,
                      },
                    },
                  }}
                />
              </Box>

              {/* Botones de acción */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleLimpiarFiltros}
                  disabled={loading}
                  sx={{
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    px: 3,
                  }}
                >
                  Limpiar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAplicarFiltros}
                  disabled={loading}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    px: 4,
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  {loading ? "Aplicando..." : "Aplicar Filtros"}
                </Button>
              </Box>
            </Stack>
        </Box>
      </Collapse>
    </Box>
  );
} 