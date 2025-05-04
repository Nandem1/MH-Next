"use client";

import { useEffect, useState } from "react";
import { FacturaPageContent } from "@/components/dashboard/FacturaPageContent";
import { Typography, Box } from "@mui/material";
import Footer from "@/components/shared/Footer";

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
      {/* Contenido principal */}
      <Box
        sx={{
          flexGrow: 1,
          mt: 8,
          px: { xs: 2, md: 3 },
        }}
      >
        <Typography variant="h4" gutterBottom>
          Facturas
        </Typography>

        <FacturaPageContent />
      </Box>

      <Footer />
    </Box>
  );
}
