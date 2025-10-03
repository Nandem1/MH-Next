import { VencimientosPageContent } from "@/components/dashboard/VencimientosPageContent";
import Box from "@mui/material/Box";
import { Metadata } from "next";
import { LegacyBanner } from "@/components/shared/LegacyBanner";

export const metadata: Metadata = {
  title: "Vencimientos",
};

export default function VencimientosPage() {
  return (
    <Box sx={{ minHeight: "95vh", display: "flex", flexDirection: "column", mt: 8, px: { xs: 2, md: 3 } }}>
      <LegacyBanner />
      <VencimientosPageContent />
    </Box>
  );
} 