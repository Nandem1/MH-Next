"use client";

import { Box, Snackbar, Alert, useTheme } from "@mui/material";
import { RindeGastosContent } from "@/components/dashboard/RindeGastosContent";
import { useSnackbar } from "@/hooks/useSnackbar";
import { AnimatedBox, AnimatedPaper } from "@/components/ui/animated";
import { useAnimations } from "@/hooks/useAnimations";

export default function RindeGastosPage() {
  const theme = useTheme();
  const { open, message, severity, handleClose, showSnackbar } = useSnackbar();

  // Animaciones sutiles y profesionales
  const containerAnimation = useAnimations({ preset: 'fade', delay: 0.1 });
  const paperAnimation = useAnimations({ preset: 'fade', delay: 0.2 });
  const contentAnimation = useAnimations({ preset: 'fade', delay: 0.3 });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      <AnimatedBox 
        {...containerAnimation}
        sx={{ flexGrow: 1, mt: 12, px: { xs: 3, md: 4 }, pb: 3 }}
      >
        <AnimatedPaper 
          {...paperAnimation}
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
          <AnimatedBox 
            {...contentAnimation}
            sx={{ 
              p: { xs: 3, md: 4 },
              flex: 1,
              overflow: "auto",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <RindeGastosContent showSnackbar={showSnackbar} />
          </AnimatedBox>
        </AnimatedPaper>
      </AnimatedBox>

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
