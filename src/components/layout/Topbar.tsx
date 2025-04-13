"use client";

import { AppBar, Toolbar, IconButton, Typography, Box, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useThemeContext } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface TopbarProps {
  handleDrawerToggle: () => void;
  isMobile: boolean;
}

const drawerWidth = 240;

export function Topbar({ handleDrawerToggle, isMobile }: TopbarProps) {
  const { toggleTheme, mode } = useThemeContext();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // 🔒 Solo cerramos sesión directamente ahora
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
        ml: isMobile ? 0 : `${drawerWidth}px`,
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
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>

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

      </Toolbar>
    </AppBar>
  );
}
