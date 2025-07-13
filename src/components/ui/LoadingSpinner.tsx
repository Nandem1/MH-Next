import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullHeight?: boolean;
}

export function LoadingSpinner({ 
  size = 40, 
  message = "Cargando...", 
  fullHeight = false 
}: LoadingSpinnerProps) {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        gap: 2,
        ...(fullHeight && { height: "100vh" })
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
} 