"use client";

import { useMemo, useState } from "react";
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
  Popover,
} from "@mui/material";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useResponsive } from "@/hooks/useResponsive";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useProveedores } from "@/hooks/useProveedores";

interface FacturaSearchBarProps {
  onSearch: (folio: string, chequeCorrelativo: string, local: string, usuario: string, proveedor: string) => void;
  onClear: () => void;
  onLocalChange: (local: string) => void;
  onUsuarioChange: (usuario: string) => void;
  onProveedorChange: (proveedor: string) => void;
  onFechaDesdeChange: (fechaDesde: string) => void;
  onFechaHastaChange: (fechaHasta: string) => void;
  localActual: string;
  usuarioActual: string;
  proveedorActual: string;
  fechaDesdeActual: string;
  fechaHastaActual: string;
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
  onFechaDesdeChange,
  onFechaHastaChange,
  localActual,
  usuarioActual,
  proveedorActual,
  fechaDesdeActual,
  fechaHastaActual,
  onGestionCheques,
}: FacturaSearchBarProps) {
  const theme = useTheme();
  const [folio, setFolio] = useState("");
  const [chequeCorrelativo, setChequeCorrelativo] = useState("");
  const isSmall = useResponsive("(max-width:600px)");
  
  // Estado para el calendario de rango
  const [calendarAnchor, setCalendarAnchor] = useState<HTMLButtonElement | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [seleccionandoInicio, setSeleccionandoInicio] = useState(true);
  
  const { data: usuarios, isLoading: isLoadingUsuarios } = useUsuarios();
  const { data: proveedores, isLoading: isLoadingProveedores } = useProveedores();

  // Deduplicar por nombre para evitar claves repetidas en Autocomplete (ej: "SIN NOMBRE")
  const proveedoresUnicos = useMemo(() => {
    const map = new Map<string, { id: number; nombre: string }>();
    (proveedores || []).forEach((p: { id: number; nombre: string }) => {
      if (!map.has(p.nombre)) map.set(p.nombre, p);
    });
    return Array.from(map.values());
  }, [proveedores]);

  const usuariosUnicos = useMemo(() => {
    const map = new Map<string, { id: number; nombre: string }>();
    (usuarios || []).forEach((u: { id: number; nombre: string }) => {
      if (!map.has(u.nombre)) map.set(u.nombre, u);
    });
    return Array.from(map.values());
  }, [usuarios]);

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

  // Handlers para el calendario de rango
  const handleCalendarOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCalendarAnchor(event.currentTarget);
    // Inicializar con fechas actuales si existen
    if (fechaDesdeActual) {
      const [year, month, day] = fechaDesdeActual.split('-').map(Number);
      setFechaInicio(new Date(year, month - 1, day));
    }
    if (fechaHastaActual) {
      const [year, month, day] = fechaHastaActual.split('-').map(Number);
      setFechaFin(new Date(year, month - 1, day));
    }
  };

  const handleCalendarClose = () => {
    setCalendarAnchor(null);
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;

    if (seleccionandoInicio) {
      setFechaInicio(date);
      setFechaFin(null);
      setSeleccionandoInicio(false);
    } else {
      // Si la fecha seleccionada es anterior a la fecha inicio, intercambiar
      if (date < fechaInicio!) {
        setFechaFin(fechaInicio);
        setFechaInicio(date);
      } else {
        setFechaFin(date);
      }
      setSeleccionandoInicio(true);
    }
  };

  const handleApplyDateRange = () => {
    if (fechaInicio) {
      // Formatear fecha sin problemas de timezone
      const year = fechaInicio.getFullYear();
      const month = String(fechaInicio.getMonth() + 1).padStart(2, '0');
      const day = String(fechaInicio.getDate()).padStart(2, '0');
      const fechaInicioStr = `${year}-${month}-${day}`;
      onFechaDesdeChange(fechaInicioStr);
    }
    if (fechaFin) {
      // Formatear fecha sin problemas de timezone
      const year = fechaFin.getFullYear();
      const month = String(fechaFin.getMonth() + 1).padStart(2, '0');
      const day = String(fechaFin.getDate()).padStart(2, '0');
      const fechaFinStr = `${year}-${month}-${day}`;
      onFechaHastaChange(fechaFinStr);
    }
    handleCalendarClose();
  };

  const handleClearDateRange = () => {
    setFechaInicio(null);
    setFechaFin(null);
    setSeleccionandoInicio(true);
    onFechaDesdeChange("");
    onFechaHastaChange("");
    // No cerrar el calendario, solo limpiar las fechas
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folio.trim() || chequeCorrelativo.trim() || localActual || usuarioActual || proveedorActual || fechaDesdeActual || fechaHastaActual) {
      onSearch(folio, chequeCorrelativo, localActual, usuarioActual, proveedorActual);
    }
  };

  const handleClear = () => {
    setFolio("");
    setChequeCorrelativo("");
    onClear();
    // Limpiar también los filtros de fechas
    onFechaDesdeChange("");
    onFechaHastaChange("");
    // Limpiar también el estado interno del calendario
    setFechaInicio(null);
    setFechaFin(null);
    setSeleccionandoInicio(true);
  };

  // Encontrar los valores seleccionados para mostrar en los Autocomplete
  const selectedUsuario = usuarios?.find(u => u.id.toString() === usuarioActual) || null;
  const selectedProveedor = proveedores?.find(p => p.id.toString() === proveedorActual) || null;
  const selectedLocal = locales.find(l => l.id === localActual) || null;

  // Verificar si hay filtros activos
  const hasActiveFilters = folio.trim() || chequeCorrelativo.trim() || localActual || usuarioActual || proveedorActual || fechaDesdeActual || fechaHastaActual;

  // Texto para mostrar en el botón del calendario
  const getCalendarButtonText = () => {
    if (fechaDesdeActual && fechaHastaActual) {
      const [yearDesde, monthDesde, dayDesde] = fechaDesdeActual.split('-').map(Number);
      const [yearHasta, monthHasta, dayHasta] = fechaHastaActual.split('-').map(Number);
      const desde = new Date(yearDesde, monthDesde - 1, dayDesde).toLocaleDateString();
      const hasta = new Date(yearHasta, monthHasta - 1, dayHasta).toLocaleDateString();
      return desde === hasta ? desde : `${desde} - ${hasta}`;
    }
    return "Seleccionar fechas";
  };

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
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Primera fila: Búsquedas principales */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmall ? "column" : "row",
            gap: 2,
            alignItems: "stretch",
          }}
        >
          <Tooltip 
            title={chequeCorrelativo.trim() ? "Deshabilita el campo de correlativo de cheque" : ""}
            placement="top"
          >
            <TextField
              label="Buscar por Folio"
              variant="outlined"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              fullWidth={isSmall}
              size="small"
              placeholder="Ingrese el folio de la factura"
              disabled={!!chequeCorrelativo.trim()}
              sx={{
                flex: isSmall ? "none" : 1,
                minWidth: isSmall ? "100%" : "auto",
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
                // Estilos para campo deshabilitado
                "&.Mui-disabled": {
                  bgcolor: theme.palette.action.disabledBackground,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: theme.palette.action.disabled,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.palette.action.disabled,
                  },
                },
              }}
              InputProps={{
                style: { color: theme.palette.text.primary },
              }}
              InputLabelProps={{
                style: { color: theme.palette.text.secondary },
              }}
            />
          </Tooltip>

          <Tooltip 
            title={folio.trim() ? "Deshabilita el campo de folio" : ""}
            placement="top"
          >
            <TextField
              label="Buscar por Correlativo de Cheque"
              variant="outlined"
              value={chequeCorrelativo}
              onChange={(e) => setChequeCorrelativo(e.target.value)}
              fullWidth={isSmall}
              size="small"
              placeholder="Ingrese el correlativo del cheque"
              disabled={!!folio.trim()}
              sx={{
                flex: isSmall ? "none" : 1,
                minWidth: isSmall ? "100%" : "auto",
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
                // Estilos para campo deshabilitado
                "&.Mui-disabled": {
                  bgcolor: theme.palette.action.disabledBackground,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: theme.palette.action.disabled,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.palette.action.disabled,
                  },
                },
              }}
              InputProps={{
                style: { color: theme.palette.text.primary },
              }}
              InputLabelProps={{
                style: { color: theme.palette.text.secondary },
              }}
            />
          </Tooltip>
        </Box>

        {/* Segunda fila: Filtros de selección */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmall ? "column" : "row",
            gap: 2,
            alignItems: "stretch",
          }}
        >
          <Autocomplete
            disablePortal
            options={proveedoresUnicos}
            getOptionLabel={(option) => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedProveedor}
            onChange={handleProveedorChange}
            loading={isLoadingProveedores}
            fullWidth={isSmall}
            size="small"
            sx={{ 
              flex: isSmall ? "none" : 1,
              minWidth: isSmall ? "100%" : "auto",
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
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedLocal}
            onChange={handleLocalChange}
            fullWidth={isSmall}
            size="small"
            sx={{ 
              flex: isSmall ? "none" : 1,
              minWidth: isSmall ? "100%" : "auto",
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
            options={usuariosUnicos}
            getOptionLabel={(option) => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedUsuario}
            onChange={handleUsuarioChange}
            loading={isLoadingUsuarios}
            fullWidth={isSmall}
            size="small"
            sx={{ 
              flex: isSmall ? "none" : 1,
              minWidth: isSmall ? "100%" : "auto",
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
        </Box>

        {/* Tercera fila: Calendario y botones de acción */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmall ? "column" : "row",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCalendarOpen}
            startIcon={<CalendarTodayIcon />}
            fullWidth={isSmall}
            size="small"
            sx={{ 
              minWidth: isSmall ? "100%" : 200,
              textTransform: "none",
              borderRadius: "8px",
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              "&:hover": {
                borderColor: theme.palette.text.primary,
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            {getCalendarButtonText()}
          </Button>

          <Stack 
            direction={isSmall ? "column" : "row"} 
            spacing={2} 
            sx={{ 
              minWidth: isSmall ? "100%" : "auto",
              flex: isSmall ? "none" : 1,
              justifyContent: isSmall ? "stretch" : "flex-end",
            }}
          >
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
      </Box>

      {/* Popover del calendario */}
      <Popover
        open={Boolean(calendarAnchor)}
        anchorEl={calendarAnchor}
        onClose={handleCalendarClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            p: 2,
            minWidth: 320,
          }
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary", mb: 1 }}>
              Seleccionar Rango de Fechas
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {seleccionandoInicio 
                ? "Selecciona la fecha de inicio" 
                : "Selecciona la fecha de fin"
              }
            </Typography>
            {fechaInicio && (
              <Typography variant="body2" sx={{ color: "text.primary", mt: 1 }}>
                Desde: {fechaInicio.toLocaleDateString()}
              </Typography>
            )}
            {fechaFin && (
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                Hasta: {fechaFin.toLocaleDateString()}
              </Typography>
            )}
          </Box>
          
          <DateCalendar
            value={seleccionandoInicio ? fechaInicio : fechaFin}
            onChange={handleDateSelect}
            sx={{
              '& .MuiPickersDay-root': {
                borderRadius: '8px',
                '&.Mui-selected': {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                },
                '&.MuiPickersDay-today': {
                  border: `2px solid ${theme.palette.primary.main}`,
                },
              },
            }}
          />
          
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleApplyDateRange}
              disabled={!fechaInicio}
              fullWidth
              sx={{ 
                textTransform: "none", 
                borderRadius: "8px",
              }}
            >
              Aplicar
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearDateRange}
              fullWidth
              sx={{ 
                textTransform: "none", 
                borderRadius: "8px",
              }}
            >
              Limpiar
            </Button>
          </Stack>
        </LocalizationProvider>
      </Popover>

      {/* Mostrar filtros activos */}
      {hasActiveFilters && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
          {folio && (
            <Chip
              label={`Folio: ${folio}`}
              size="small"
              onDelete={() => {
                setFolio("");
                onSearch("", chequeCorrelativo, localActual, usuarioActual, proveedorActual);
              }}
              sx={{
                bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            />
          )}
          {chequeCorrelativo && (
            <Chip
              label={`Cheque: ${chequeCorrelativo}`}
              size="small"
              onDelete={() => {
                setChequeCorrelativo("");
                onSearch(folio, "", localActual, usuarioActual, proveedorActual);
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
                onSearch(folio, chequeCorrelativo, "", usuarioActual, proveedorActual);
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
                onSearch(folio, chequeCorrelativo, localActual, "", proveedorActual);
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
                onSearch(folio, chequeCorrelativo, localActual, usuarioActual, "");
              }}
              sx={{
                bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            />
          )}
                     {fechaDesdeActual && fechaHastaActual && (
             <Chip
               label={`Fechas: ${(() => {
                 const [yearDesde, monthDesde, dayDesde] = fechaDesdeActual.split('-').map(Number);
                 const [yearHasta, monthHasta, dayHasta] = fechaHastaActual.split('-').map(Number);
                 const desde = new Date(yearDesde, monthDesde - 1, dayDesde).toLocaleDateString();
                 const hasta = new Date(yearHasta, monthHasta - 1, dayHasta).toLocaleDateString();
                 return `${desde} - ${hasta}`;
               })()}`}
               size="small"
               onDelete={() => {
                 onFechaDesdeChange("");
                 onFechaHastaChange("");
                 onSearch(folio, chequeCorrelativo, localActual, usuarioActual, proveedorActual);
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