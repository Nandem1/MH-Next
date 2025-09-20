import { Metadata } from "next";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: "Caja Chica - Nóminas de Gastos",
};

export default function CajaChicaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {children}
    </Box>
  );
}
