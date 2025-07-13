"use client";

import Box from "@mui/material/Box";
import Footer from "@/components/shared/Footer";
import { ZebrAIGenerator } from "@/components/zebra/ZebrAIGenerator";

export default function ZebrAIPage() {
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
        <ZebrAIGenerator />
      </Box>

      <Footer />
    </Box>
  );
}
