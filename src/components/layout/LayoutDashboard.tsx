"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Box, useMediaQuery } from "@mui/material";
import { useState } from "react";

export function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)"); // 📱 Detectar Mobile o Desktop

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar recibe el estado de mobile */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%", // 📏 MUY IMPORTANTE
          minHeight: "100vh", // ⬅️ Para que nunca quede más chico
        }}
      >
        {/* Topbar recibe si es mobile */}
        <Topbar
          handleDrawerToggle={handleDrawerToggle}
          isMobile={isMobile}
        />

        {/* Aquí van las páginas */}
        <Box sx={{ flexGrow: 1, padding: 2, mt: 8 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
