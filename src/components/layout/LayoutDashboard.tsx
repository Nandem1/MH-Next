// components/layout/LayoutDashboard.tsx
"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Box, useMediaQuery } from "@mui/material";
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
//import { drawerWidth } from "@/constants/layout";

export function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const { isAuthenticated } = useAuth();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* ───── Sidebar ───── */}
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      {/* ───── Contenido principal ───── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: 0, md: '120px'}          // padding habitual
          /* QUITA estas dos líneas  👇           */
          /* ml:  { xs: 0, md: `${drawerWidth}px` }, */
          /* width:{ xs: '100%', md: `calc(100% - ${drawerWidth}px)` }, */
        }}
      >
        {/* Topbar fija */}
        <Topbar handleDrawerToggle={handleDrawerToggle} isMobile={isMobile} />

        {/* Contenido dinámico */}
        <Box
          sx={{
            /* Padding interior agradable que NO depende del Drawer */
            px: 2,
            py: 2,
            mt: 8,               // separa del AppBar
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
