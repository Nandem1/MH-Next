"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
import { LegacyBanner } from "@/components/shared/LegacyBanner";

// Lazy load del componente pesado
const CarteleriaPageContent = dynamic(
  () => import("@/components/dashboard/CarteleriaPageContent").then(mod => ({ default: mod.CarteleriaPageContent })),
  {
    loading: () => (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false, // Deshabilitar SSR para este componente pesado
  }
);

export default function AuditoriaCarteleriaPage() {
  return (
    <Box sx={{ minHeight: "95vh", display: "flex", flexDirection: "column", mt: 8, px: { xs: 2, md: 3 } }}>
      <LegacyBanner />
      <CarteleriaPageContent />
    </Box>
  );
}
