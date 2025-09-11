"use client";

import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { NominaCantera } from "@/types/nominaCheque";

interface NominaMenuActionsProps {
  nomina: NominaCantera;
  onVerDetalles: (nomina: NominaCantera) => void;
  onEliminar: (nomina: NominaCantera) => void;
}

export function NominaMenuActions({
  nomina,
  onVerDetalles,
  onEliminar,
}: NominaMenuActionsProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleVerDetalles = () => {
    handleClose();
    onVerDetalles(nomina);
  };

  const handleEliminar = () => {
    handleClose();
    onEliminar(nomina);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: theme.palette.text.secondary,
          "&:hover": {
            color: theme.palette.text.primary,
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            minWidth: 180,
            mt: 1,
          },
        }}
      >
        <MenuItem
          onClick={handleVerDetalles}
          sx={{
            py: 1.5,
            px: 2,
            "&:hover": {
              bgcolor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Ver detalles"
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          />
        </MenuItem>
        <MenuItem
          onClick={handleEliminar}
          sx={{
            py: 1.5,
            px: 2,
            "&:hover": {
              bgcolor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Eliminar nómina"
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
