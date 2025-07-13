"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ControlVencimientosPageContent } from "@/components/dashboard/ControlVencimientosPageContent";

export default function ControlVencimientosPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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