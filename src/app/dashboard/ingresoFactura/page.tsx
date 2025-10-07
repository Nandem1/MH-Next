"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
import Footer from "@/components/shared/Footer";
import { AnimatedBox, AnimatedTypography } from "@/components/ui/animated";
import { useAnimations, useInViewAnimations } from "@/hooks/useAnimations";

// Lazy load del componente pesado
const IngresoFacturaContent = dynamic(
  () => import("../../../components/dashboard/IngresoFacturaContent"),
  {
    loading: () => (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false, // Deshabilitar SSR para este componente pesado
  }
);

export default function IngresoFacturaPage() {
  const [mounted, setMounted] = useState(false);
  
  // Animaciones sutiles y profesionales
  const titleAnimation = useAnimations({ preset: 'fade', delay: 0.1 });
  const contentAnimation = useAnimations({ preset: 'fade', delay: 0.3 });
  const footerAnimation = useInViewAnimations({ threshold: 0.1 });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      {/* Contenido principal */}
      <Box
        sx={{
          flexGrow: 1,
          pt: 10,
          pb: 4,
          px: { xs: 2, md: 3 },
        }}
      >
        <AnimatedTypography 
          {...titleAnimation}
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 3
          }}
        >
          Ingreso de Factura
        </AnimatedTypography>

        <AnimatedBox {...contentAnimation}>
          <IngresoFacturaContent />
        </AnimatedBox>
      </Box>

      <AnimatedBox {...footerAnimation}>
        <Footer />
      </AnimatedBox>
    </Box>
  );
}
