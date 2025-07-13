"use client";

// src/components/shared/Footer.tsx


import Box from "@mui/material/Box";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        pt: 3,
        textAlign: "center",
        fontSize: "0.8rem",
        color: "text.secondary",
        borderTop: "1px solid",
        borderColor: "divider",
        mt: 2,
      }}
    >
      © {new Date().getFullYear()} Mercado House SPA · Todos los derechos
      reservados
    </Box>
  );
}
