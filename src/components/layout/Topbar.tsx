"use client";

import { IconButton, Typography, Box, Button, AppBar, Toolbar } from "@mui/material";



import MenuIcon from "@mui/icons-material/Menu";
import { useThemeContext } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { drawerWidth } from "@/constants/layout";
import { useCallback, useEffect } from "react";

interface TopbarProps {
  handleDrawerToggle: () => void;
  isMobile: boolean;
}

export function Topbar({ handleDrawerToggle, isMobile }: TopbarProps) {
  const { toggleTheme, mode } = useThemeContext();
  const { logout, usuario, loadUsuario } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const getNombreLocal = (id_local: number | null): string => {
    switch (id_local) {
      case 1:
        return "LA CANTERA 3055";
      case 2:
        return "LIBERTADOR 1476";
      case 3:
        return "BALMACEDA 599";
      default:
        return "Local desconocido";
    }
  };

  useEffect(() => {
    if (!usuario) {
      loadUsuario(); // 👈 Cargar usuario si aún no existe
    }
  }, [usuario, loadUsuario]);

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` }, // Solo width, NO ml
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: 1,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* IZQUIERDA */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            MH Dashboard
          </Typography>
        </Box>

        {/* DERECHA */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* 👤 Usuario y Local - SOLO EN DESKTOP */}
          {usuario?.nombre && (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                alignItems: "flex-end",
                mr: 1,
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                Hola, {usuario.nombre}
              </Typography>
              {usuario.id_local !== null && (
                <Typography variant="caption" color="text.secondary">
                  {getNombreLocal(usuario.id_local)}
                </Typography>
              )}
            </Box>
          )}

          {/* Botón modo oscuro - SIEMPRE visible */}
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>

          {/* Botón logout - SOLO EN DESKTOP */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleLogout}
              sx={{ textTransform: "none" }}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
