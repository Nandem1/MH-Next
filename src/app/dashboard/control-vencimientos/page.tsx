"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ControlVencimientosPageContent } from "@/components/dashboard/ControlVencimientosPageContent";
import { LegacyBanner } from "@/components/shared/LegacyBanner";

export default function ControlVencimientosPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mt: 4 }}>
        <LegacyBanner />
      </Box>
      
      <Box mb={4} mt={5}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Control de Vencimientos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestión integral de productos con fechas de vencimiento próximas
        </Typography>
      </Box>
      
      <ControlVencimientosPageContent />
    </Container>
  );
} 