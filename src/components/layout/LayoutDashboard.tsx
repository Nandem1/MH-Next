"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useState, useCallback } from "react";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useRouter } from "next/navigation";
import { AnimatedBox } from "@/components/ui/animated/AnimatedComponents";
import { PageTransition } from "@/components/ui/animated/PageTransition";
import { useAnimations } from "@/hooks/useAnimations";

export function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const { isAuthenticated, isLoading } = useAuthStatus();
  const router = useRouter();

  // Configuración de animaciones staggered para el layout
  const layoutAnimation = useAnimations({ preset: 'fade', delay: 0.1 });
  const sidebarAnimation = useAnimations({ preset: 'fade', delay: 0.2 });
  const topbarAnimation = useAnimations({ preset: 'fade', delay: 0.3 });
  const contentAnimation = useAnimations({ preset: 'fade', delay: 0.5 });

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  if (isLoading) {
    return (
      <AnimatedBox
        {...layoutAnimation}
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </AnimatedBox>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <AnimatedBox 
      {...layoutAnimation}
      sx={{ 
        display: "flex", 
        height: "100vh", // Altura fija de viewport
        overflow: "hidden" // Sin scroll en el contenedor principal
      }}
    >
      {/* Sidebar (fijo a la izquierda) */}
      <AnimatedBox
        {...sidebarAnimation}
        sx={{
          width: { md: 240 },
          flexShrink: 0,
          height: "100vh", // Altura completa
          position: "fixed", // Fijo
          left: 0,
          top: 0,
          zIndex: 1200,
          display: { xs: "none", md: "block" } // Solo en desktop
        }}
      >
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
      </AnimatedBox>

      {/* Main content area */}
      <Box sx={{ 
        flexGrow: 1, 
        display: "flex", 
        flexDirection: "column",
        ml: { md: "240px" }, // Margen para el sidebar fijo
        height: "100vh"
      }}>
        {/* Topbar (fijo arriba) */}
        <AnimatedBox 
          {...topbarAnimation}
          sx={{ 
            flexShrink: 0,
            position: "sticky",
            top: 0,
            zIndex: 1100,
            backgroundColor: "background.paper"
          }}
        >
          <Topbar handleDrawerToggle={handleDrawerToggle} isMobile={isMobile} />
        </AnimatedBox>

        {/* Contenido scrolleable */}
        <AnimatedBox
          {...contentAnimation}
          sx={{
            flex: 1,
            overflow: "auto", // Solo el contenido hace scroll
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 3 },
          }}
        >
          <PageTransition>
            {children}
          </PageTransition>
        </AnimatedBox>
      </Box>

      {/* Sidebar mobile */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
      </Box>
    </AnimatedBox>
  );
}
