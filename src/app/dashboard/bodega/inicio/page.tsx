"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ConstructionIcon from "@mui/icons-material/Construction";

export default function BodegaInicioPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        px: 3,
      }}
    >
      <ConstructionIcon 
        sx={{ 
          fontSize: 80, 
          color: "warning.main", 
          mb: 3 
        }} 
      />
      
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
        🚧 En Construcción
      </Typography>
      
      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        Página de Inicio de Bodega
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
        Esta sección estará disponible próximamente. Aquí podrás ver un resumen general 
        del estado de la bodega, alertas de stock bajo y estadísticas importantes.
      </Typography>
    </Box>
  );
} 