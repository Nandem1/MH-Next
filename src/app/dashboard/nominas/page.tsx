"use client";

import { Box, Typography } from "@mui/material";

export default function NominasPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography variant="h3" fontWeight="bold">
        🚧 Página en construcción
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Este módulo estará disponible pronto.
      </Typography>
    </Box>
  );
}
