"use client";

import { Box, Paper, Snackbar, Alert, useTheme } from "@mui/material";
import { RindeGastosContent } from "@/components/dashboard/RindeGastosContent";
import { useSnackbar } from "@/hooks/useSnackbar";

export default function RindeGastosPage() {
  const theme = useTheme();
  const { open, message, severity, handleClose, showSnackbar } = useSnackbar();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      <Box sx={{ flexGrow: 1, mt: 12, px: { xs: 3, md: 4 }, pb: 3 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            border: 1, 
            borderColor: "divider",
            borderRadius: 1.5,
            overflow: "hidden",
            minHeight: "calc(100vh - 140px)",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Box sx={{ 
            p: { xs: 3, md: 4 },
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
            <RindeGastosContent showSnackbar={showSnackbar} />
          </Box>
        </Paper>
      </Box>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{
            width: "100%",
            borderRadius: "8px",
            border: `1px solid ${severity === "success" ? theme.palette.success.light : theme.palette.error.light}`,
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
