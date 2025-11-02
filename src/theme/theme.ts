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
          backgroundColor: "#0a0a0a",
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
      default: "#ffffff",
      paper: "#ffffff",
    },
    divider: "#e0e0e0",
    text: {
      primary: "#1a1a1a",
      secondary: "#666666",
    },
    action: {
      hover: "rgba(0, 0, 0, 0.04)",
      selected: "#1a1a1a",
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
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e0e0e0",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#e0e0e0",
        },
      },
    },
  },
});

