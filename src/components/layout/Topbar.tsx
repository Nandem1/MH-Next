"use client";

import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useThemeContext } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface TopbarProps {
  handleDrawerToggle: () => void;
  isMobile: boolean;
}

const drawerWidth = 240;

export function Topbar({ handleDrawerToggle, isMobile }: TopbarProps) {
  const { toggleTheme, mode } = useThemeContext();

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Botón de hamburguesa SOLO en mobile */}
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

        {/* Botón para cambiar el tema */}
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
