"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Box, useMediaQuery } from "@mui/material";
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { drawerWidth } from "@/constants/layout";

export function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const { isAuthenticated } = useAuth();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          paddingLeft: { xs: 0, md: `${drawerWidth - 120}px` }, // 👈 ESTE ES EL CAMBIO
        }}
      >
        {/* Topbar */}
        <Topbar handleDrawerToggle={handleDrawerToggle} isMobile={isMobile} />

        {/* Contenido dinámico */}
        <Box sx={{ padding: 2, mt: 8 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
