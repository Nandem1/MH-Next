// src/providers/ThemeRegistry.tsx
"use client";

import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import createEmotionCache from "@/utils/emotionCache";
import { ReactNode } from "react";
import { Theme } from "@mui/material/styles";

const clientSideEmotionCache = createEmotionCache();

interface ThemeRegistryProps {
  children: ReactNode;
  theme: Theme;
}

export function ThemeRegistry({ children, theme }: ThemeRegistryProps) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

