"use client";

import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField, Button, CircularProgress, useTheme } from "@mui/material";
import { AnimatedPaper } from "@/components/ui/animated";
import { Usuario } from "@/services/usuarioService";
import { locales } from "@/hooks/useAuthStatus";
import { useAnimations } from "@/hooks/useAnimations";

interface FiltrosNominasGastosProps {
  filtroLocal: number | null;
  filtroUsuario: string;
  onFiltroLocalChange: (localId: number | null) => void;
  onFiltroUsuarioChange: (nombreUsuario: string) => void;
  onLimpiarFiltros: () => void;
  usuarios: Usuario[] | undefined;
  isLoadingUsuarios: boolean;
  filtersAnimation: ReturnType<typeof useAnimations>;
}

export function FiltrosNominasGastos({
  filtroLocal,
  filtroUsuario,
  onFiltroLocalChange,
  onFiltroUsuarioChange,
  onLimpiarFiltros,
  usuarios,
  isLoadingUsuarios,
  filtersAnimation,
}: FiltrosNominasGastosProps) {
  const theme = useTheme();

  return (
    <AnimatedPaper
      {...filtersAnimation}
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderRadius: "8px",
        border: `1px solid ${theme.palette.divider}`,
        p: 2,
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: "text.primary", fontSize: "0.875rem" }}>
        Filtros
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Local</InputLabel>
          <Select
            value={filtroLocal ?? ""}
            label="Local"
            onChange={(e) => {
              const value = (e.target as HTMLInputElement).value as unknown;
              const selectedId = value === "" ? null : Number(value);
              onFiltroLocalChange(selectedId);
            }}
          >
            <MenuItem value="">Todos los locales</MenuItem>
            {locales.map((local) => (
              <MenuItem key={local.id} value={local.id}>
                {local.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Autocomplete
          disablePortal
          options={usuarios || []}
          getOptionLabel={(option) => option.nombre}
          value={usuarios?.find(u => u.nombre === filtroUsuario) || null}
          onChange={(event, newValue) => {
            onFiltroUsuarioChange(newValue ? newValue.nombre : "");
          }}
          loading={isLoadingUsuarios}
          fullWidth
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Usuario"
              placeholder="Buscar por usuario..."
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
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={onLimpiarFiltros}
          sx={{ height: 40, minWidth: 120 }}
        >
          Limpiar Filtros
        </Button>
      </Box>
    </AnimatedPaper>
  );
}

