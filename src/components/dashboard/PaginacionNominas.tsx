"use client";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
}

interface PaginacionNominasProps {
  pagination: PaginationInfo;
  onCambiarPagina: (pagina: number) => void;
  onCambiarLimite: (limite: number) => void;
  loading?: boolean;
}

const opcionesLimite = [10, 20, 50, 100];

export function PaginacionNominas({
  pagination,
  onCambiarPagina,
  onCambiarLimite,
  loading = false,
}: PaginacionNominasProps) {
  const theme = useTheme();
  const { page, limit, total, hasNext } = pagination;

  const totalPaginas = Math.ceil(total / limit);
  const inicio = (page - 1) * limit + 1;
  const fin = Math.min(page * limit, total);

  const handlePrimeraPagina = () => {
    if (page > 1) {
      onCambiarPagina(1);
    }
  };

  const handlePaginaAnterior = () => {
    if (page > 1) {
      onCambiarPagina(page - 1);
    }
  };

  const handlePaginaSiguiente = () => {
    if (hasNext) {
      onCambiarPagina(page + 1);
    }
  };

  const handleUltimaPagina = () => {
    if (hasNext) {
      onCambiarPagina(totalPaginas);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        bgcolor: "background.default",
        borderRadius: "12px",
        border: `1px solid ${theme.palette.divider}`,
        mt: 2,
      }}
    >
      {/* Información de resultados */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Mostrando {inicio} a {fin} de {total} resultados
        </Typography>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel
            sx={{
              color: theme.palette.text.secondary,
              "&.Mui-focused": { color: theme.palette.primary.main },
            }}
          >
            Por página
          </InputLabel>
          <Select
            value={limit}
            label="Por página"
            onChange={(e) => onCambiarLimite(Number(e.target.value))}
            disabled={loading}
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
            {opcionesLimite.map((opcion) => (
              <MenuItem key={opcion} value={opcion}>
                {opcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Controles de paginación */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handlePrimeraPagina}
          disabled={page <= 1 || loading}
          sx={{
            minWidth: "auto",
            px: 1,
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            },
          }}
        >
          <KeyboardDoubleArrowLeft />
        </Button>

        <Button
          variant="outlined"
          size="small"
          onClick={handlePaginaAnterior}
          disabled={page <= 1 || loading}
          sx={{
            minWidth: "auto",
            px: 1,
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            },
          }}
        >
          <KeyboardArrowLeft />
        </Button>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: "8px",
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Página {page} de {totalPaginas}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={handlePaginaSiguiente}
          disabled={!hasNext || loading}
          sx={{
            minWidth: "auto",
            px: 1,
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            },
          }}
        >
          <KeyboardArrowRight />
        </Button>

        <Button
          variant="outlined"
          size="small"
          onClick={handleUltimaPagina}
          disabled={!hasNext || loading}
          sx={{
            minWidth: "auto",
            px: 1,
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            },
          }}
        >
          <KeyboardDoubleArrowRight />
        </Button>
      </Box>
    </Box>
  );
} 