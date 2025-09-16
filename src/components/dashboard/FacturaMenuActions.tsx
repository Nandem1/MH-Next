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
  Settings as SettingsIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Factura } from "@/types/factura";

interface FacturaMenuActionsProps {
  factura: Factura;
  onView: (factura: Factura) => void;
  onEditarCamposBasicos: (factura: Factura) => void;
  onDelete?: (factura: Factura) => void;
}

export function FacturaMenuActions({
  factura,
  onView,
  onEditarCamposBasicos,
  onDelete,
}: FacturaMenuActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    onView(factura);
    handleClose();
  };

  const handleEditarCamposBasicos = () => {
    onEditarCamposBasicos(factura);
    handleClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(factura);
    }
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: "text.secondary",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <MoreVertIcon />
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
            minWidth: 200,
            mt: 1,
            boxShadow: 2,
          },
        }}
      >
        {/* Ver factura */}
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Ver factura"
            secondary="Ver detalles completos"
          />
        </MenuItem>

        {/* Configurar campos básicos */}
        <MenuItem onClick={handleEditarCamposBasicos}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Configuración"
            secondary="Editar folio, usuario, local y proveedor"
          />
        </MenuItem>

        {/* Eliminar factura - preparado para implementar */}
        {onDelete && (
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText
              primary="Eliminar factura"
              secondary="Eliminar permanentemente"
              sx={{ color: "error.main" }}
            />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
