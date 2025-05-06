"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Typography, Box } from "@mui/material";
import { PageTitle } from "@/components/shared/PageTitle";
import Footer from "@/components/shared/Footer";

// Importar el componente dinámicamente con SSR deshabilitado
const FacturaPageContent = dynamic(
  () => import("@/components/dashboard/FacturaPageContent").then(mod => mod.FacturaPageContent),
  { ssr: false }
);

export default function FacturasPage() {
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
      <PageTitle 
        title="Facturas" 
        description="Gestiona y visualiza todas las facturas de Mercado House"
      />
      {/* Contenido principal */}
      <Box
        sx={{
          flexGrow: 1,
          mt: 8,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 3 }, mb: 2 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 500,
              color: "text.primary",
              textAlign: { xs: "center", md: "left" }
            }}
          >
            Facturas
          </Typography>
        </Box>

        <FacturaPageContent />
      </Box>

      <Footer />
    </Box>
  );
}
