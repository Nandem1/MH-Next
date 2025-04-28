// components/layout/LayoutDashboard.tsx
"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useState, useCallback } from "react";
import { useAuthStatus } from "@/hooks/useAuthStatus"; // 👈 Ahora usamos el nuevo hook
import { useRouter } from "next/navigation";

export function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const { isAuthenticated, isLoading } = useAuthStatus(); // 👈 Nuevo hook
  const router = useRouter();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* ───── Sidebar ───── */}
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      {/* ───── Contenido principal ───── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: 0, md: "120px" }, // Padding habitual
        }}
      >
        {/* Topbar fija */}
        <Topbar handleDrawerToggle={handleDrawerToggle} isMobile={isMobile} />

        {/* Contenido dinámico */}
        <Box
          sx={{
            px: 2,
            py: 2,
            mt: 8, // separa del AppBar
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

