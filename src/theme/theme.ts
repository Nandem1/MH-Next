// src/theme/theme.ts
import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFD93D", // Muted Yellow para navegación
    },
    secondary: {
      main: "#38BDF8", // Azul cielo para info general
    },
    success: {
      main: "#4ADE80", // Verde suave para success
    },
    error: {
      main: "#F87171", // Rojo suave para error
    },
    warning: {
      main: "#FACC15", // Amarillo más fuerte para warning
    },
    info: {
      main: "#38BDF8", // Azul cielo para info
    },
    background: {
      default: "#0a0a0a", // Negro profundo
      paper: "#121212", // Un negro más suave para tarjetas
    },
    divider: "#262626", // Divisiones suaves
    text: {
      primary: "#F4F4F5", // Blanco muy suave
      secondary: "#A1A1AA", // Gris clarito
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#121212",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#121212",
          borderRight: "1px solid #262626",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0a0a0a",
          borderBottom: "1px solid #262626",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #262626",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#262626",
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FFD93D", // Muted Yellow también en modo claro
    },
    secondary: {
      main: "#38BDF8",
    },
    success: {
      main: "#22C55E", // Verde brillante en light mode
    },
    error: {
      main: "#EF4444", // Rojo más vibrante en light mode
    },
    warning: {
      main: "#FACC15",
    },
    info: {
      main: "#0EA5E9", // Azul un poquito más fuerte en light
    },
    background: {
      default: "#FFFFFF",
      paper: "#F5F5F5",
    },
    text: {
      primary: "#0A0A0A",
      secondary: "#333333",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});
