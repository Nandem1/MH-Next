"use client";

import Box from "@mui/material/Box";
import Footer from "@/components/shared/Footer";
import { XMLUploader } from "@/components/movimientos/IngresoMovimientos";
import { LegacyBanner } from "@/components/shared/LegacyBanner";

export default function LectorDTEPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      <Box sx={{ flexGrow: 1, mt: 8, px: { xs: 2, md: 3 } }}>
        <LegacyBanner />
        <XMLUploader />
      </Box>

      <Footer />
    </Box>
  );
}
