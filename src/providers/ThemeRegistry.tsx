"use client";

import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import createEmotionCache from "@/utils/emotionCache";
import { ReactNode } from "react";
import { ThemeProvider as CustomThemeProvider, useThemeContext } from "@/context/ThemeContext";
import { darkTheme, lightTheme } from "@/theme/theme";

const clientSideEmotionCache = createEmotionCache();

interface ThemeRegistryProps {
  children: ReactNode;
}

export function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <CustomThemeProvider>
        <ThemeProviderWrapper>
          {children}
        </ThemeProviderWrapper>
      </CustomThemeProvider>
    </CacheProvider>
  );
}

function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  const { mode } = useThemeContext();
  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
