// src/theme/theme.ts
import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFD93D",
    },
    secondary: {
      main: "#38BDF8",
    },
    success: {
      main: "#4ADE80",
    },
    error: {
      main: "#F87171",
    },
    warning: {
      main: "#FACC15",
    },
    info: {
      main: "#38BDF8",
    },
    background: {
      default: "#0a0a0a",
      paper: "#121212",
    },
    divider: "#262626",
    text: {
      primary: "#F4F4F5",
      secondary: "#A1A1AA",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": {
          "::selection": {
            backgroundColor: "#FFD93D",
            color: "#0a0a0a",
          },
        },
      },
    },
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
      main: "#FFD93D",
    },
    secondary: {
      main: "#38BDF8",
    },
    success: {
      main: "#22C55E",
    },
    error: {
      main: "#EF4444",
    },
    warning: {
      main: "#FACC15",
    },
    info: {
      main: "#0EA5E9",
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

