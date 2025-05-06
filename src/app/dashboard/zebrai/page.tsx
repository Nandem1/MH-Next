"use client";

import { Box } from "@mui/material";
import { ZebrAIGenerator } from "@/components/zebra/ZebrAIGenerator";
import { PageTitle } from "@/components/shared/PageTitle";
import Footer from "@/components/shared/Footer";

export default function ZebrAIPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PageTitle 
        title="Zebra" 
        description="Configura y gestiona las impresoras Zebra de Mercado House"
      />
      <Box sx={{ flex: 1, p: 3, mt: 8 }}>
        <ZebrAIGenerator />
      </Box>
      <Footer />
    </Box>
  );
}
