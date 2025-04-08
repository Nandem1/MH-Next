// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#0A0A0A',
      secondary: '#333333',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});
