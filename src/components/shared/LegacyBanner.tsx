"use client";

import { Alert, AlertTitle, Box } from "@mui/material";
import { PauseCircle } from "@mui/icons-material";

interface LegacyBannerProps {
  title?: string;
  message?: string;
}

export function LegacyBanner({ 
  title = "Módulo en Hibernación",
  message = "Este módulo está en hibernación y se mantiene como demo. Permanece funcional pero ya no se desarrolla activamente mientras nos enfocamos en las características principales del negocio. Puede ser reactivado en el futuro."
}: LegacyBannerProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Alert 
        severity="info" 
        icon={<PauseCircle />}
        sx={{
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}
