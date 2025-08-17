'use client';
import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider as CustomThemeProvider, useThemeContext } from "@/context/ThemeContext";
import { darkTheme, lightTheme } from "@/theme/theme";

// Centraliza el Emotion cache (SSR/CSR) + MUI Theme en un único Client Component.
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <CustomThemeProvider>
        <ThemeProviderWrapper>
          {children}
        </ThemeProviderWrapper>
      </CustomThemeProvider>
    </AppRouterCacheProvider>
  );
}

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeContext();
  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
