"use client";

import { Box, Typography } from "@mui/material";

export default function InicioPage() {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 2,
        padding: 2,
      }}
    >
      <Typography variant="h3" fontWeight="bold">
        Bienvenido al Panel de Control
      </Typography>

      <Typography variant="subtitle1" color="textSecondary">
        Aquí podrás gestionar tus facturas, usuarios y configuración.
      </Typography>
    </Box>
  );
}
