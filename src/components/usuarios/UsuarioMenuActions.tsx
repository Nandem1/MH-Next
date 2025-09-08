// /components/usuarios/UsuarioMenuActions.tsx
"use client";

import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  AccountBalanceWallet as CajaChicaIcon,
  Business as LocalIcon,
  Lock as PasswordIcon,
} from "@mui/icons-material";
import { UsuarioCajaChica } from "@/services/cajaChicaService";

interface UsuarioMenuActionsProps {
  usuario: UsuarioCajaChica;
  onConfigurarCajaChica: (usuario: UsuarioCajaChica) => void;
  onConfigurarLocal?: (usuario: UsuarioCajaChica) => void;
  onConfigurarPassword?: (usuario: UsuarioCajaChica) => void;
}

export function UsuarioMenuActions({
  usuario,
  onConfigurarCajaChica,
  onConfigurarLocal,
  onConfigurarPassword,
}: UsuarioMenuActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConfigurarCajaChica = () => {
    onConfigurarCajaChica(usuario);
    handleClose();
  };

  const handleConfigurarLocal = () => {
    if (onConfigurarLocal) {
      onConfigurarLocal(usuario);
    }
    handleClose();
  };

  const handleConfigurarPassword = () => {
    if (onConfigurarPassword) {
      onConfigurarPassword(usuario);
    }
    handleClose();
  };

  // Determinar el color del chip según el estado de caja chica
  const getCajaChicaChipColor = () => {
    if (!usuario.tieneCajaChica) {
      return "default";
    }
    
    switch (usuario.estadoOperacional) {
      case "activo":
        return "success";
      case "requiere_reembolso":
        return "warning";
      case "inactivo":
        return "error";
      default:
        return "default";
    }
  };

  // Determinar el texto del chip según el estado de caja chica
  const getCajaChicaChipText = () => {
    if (!usuario.tieneCajaChica) {
      return "Sin caja chica";
    }
    
    switch (usuario.estadoOperacional) {
      case "activo":
        return "Activo";
      case "requiere_reembolso":
        return "Requiere reembolso";
      case "inactivo":
        return "Inactivo";
      default:
        return "Desconocido";
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
        {/* Información del estado de caja chica */}
        <MenuItem disabled sx={{ opacity: 1, cursor: "default" }}>
          <ListItemText
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Estado caja chica:
                </Typography>
                <Chip
                  label={getCajaChicaChipText()}
                  color={getCajaChicaChipColor()}
                  size="small"
                  variant="outlined"
                />
              </Box>
            }
          />
        </MenuItem>

        {/* Separador visual */}
        <MenuItem disabled sx={{ opacity: 0, height: 1, minHeight: 1, p: 0 }}>
          <Box sx={{ width: "100%", height: 1, backgroundColor: "divider" }} />
        </MenuItem>

        {/* Configurar caja chica */}
        <MenuItem onClick={handleConfigurarCajaChica}>
          <ListItemIcon>
            <CajaChicaIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Configurar caja chica"
            secondary={
              usuario.tieneCajaChica
                ? "Editar configuración"
                : "Habilitar caja chica"
            }
          />
        </MenuItem>

        {/* Configurar local (disabled por ahora) */}
        <MenuItem onClick={handleConfigurarLocal} disabled>
          <ListItemIcon>
            <LocalIcon fontSize="small" sx={{ opacity: 0.5 }} />
          </ListItemIcon>
          <ListItemText
            primary="Configurar local"
            secondary="Próximamente"
            sx={{ opacity: 0.5 }}
          />
        </MenuItem>

        {/* Configurar contraseña (disabled por ahora) */}
        <MenuItem onClick={handleConfigurarPassword} disabled>
          <ListItemIcon>
            <PasswordIcon fontSize="small" sx={{ opacity: 0.5 }} />
          </ListItemIcon>
          <ListItemText
            primary="Configurar contraseña"
            secondary="Próximamente"
            sx={{ opacity: 0.5 }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}

// Importar Box desde MUI
import { Box } from "@mui/material";
