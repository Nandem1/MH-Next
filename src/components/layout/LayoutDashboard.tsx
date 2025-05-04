"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useState, useCallback } from "react";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useRouter } from "next/navigation";

export function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const { isAuthenticated, isLoading } = useAuthStatus();
  const router = useRouter();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      {/* Sidebar (columna izquierda fija solo en desktop) */}
      <Box
        component="nav"
        sx={{
          width: { md: 240 },
          flexShrink: { md: 0 },
        }}
      >
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
      </Box>

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar en flujo */}
        <Box sx={{ flexShrink: 0 }}>
          <Topbar handleDrawerToggle={handleDrawerToggle} isMobile={isMobile} />
        </Box>

        {/* Contenido dinámico de las rutas */}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            px: { xs: 0, md: 3 },
            py: { xs: 3, md: 2 },
            gap: 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
