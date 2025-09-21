"use client";

import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { NominaGasto } from "@/types/nominasGastos";

interface NominaGastoMenuActionsProps {
  nomina: NominaGasto;
  onVerDetalles: (nomina: NominaGasto) => void;
  onImprimir?: (nomina: NominaGasto) => void;
  onEliminar?: (nomina: NominaGasto) => void;
}

export function NominaGastoMenuActions({
  nomina,
  onVerDetalles,
  onImprimir,
  onEliminar,
}: NominaGastoMenuActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
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

  const handleImprimir = () => {
    if (onImprimir) {
      handleClose();
      onImprimir(nomina);
    }
  };

  const handleEliminar = () => {
    if (onEliminar) {
      handleClose();
      onEliminar(nomina);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: "text.secondary",
          "&:hover": {
            color: "text.primary",
            bgcolor: "action.hover",
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
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            minWidth: 180,
            mt: 1,
          },
        }}
      >
        {/* Ver detalles */}
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleVerDetalles();
          }}
          sx={{
            py: 1.5,
            px: 2,
            "&:hover": {
              bgcolor: "primary.light",
              color: "primary.contrastText",
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

        {/* Imprimir */}
        {onImprimir && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleImprimir();
            }}
            sx={{
              py: 1.5,
              px: 2,
              "&:hover": {
                bgcolor: "secondary.light",
                color: "secondary.contrastText",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Imprimir"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            />
          </MenuItem>
        )}

        {/* Eliminar - disabled para otro sprint */}
        {onEliminar && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleEliminar();
            }}
            disabled
            sx={{
              py: 1.5,
              px: 2,
              opacity: 0.5,
              "&:hover": {
                bgcolor: "transparent",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Eliminar"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
