"use client";

import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
import Footer from "@/components/shared/Footer";

// Lazy load del componente pesado
const NotaCreditoPageContent = dynamic(
  () => import("@/components/dashboard/NotaCreditoPageContent").then(mod => ({ default: mod.NotaCreditoPageContent })),
  {
    loading: () => (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false, // Deshabilitar SSR para este componente pesado
  }
);

export default function NotasCreditoPage() {
  const [mounted, setMounted] = useState(false);
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
          mt: 8,
          px: { xs: 2, md: 3 },
        }}
      >
        <Typography variant="h4" gutterBottom>
          Notas de Crédito
        </Typography>

        <NotaCreditoPageContent />
      </Box>

      <Footer />
    </Box>
  );
} 