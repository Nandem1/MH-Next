"use client";

import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import createEmotionCache from "@/utils/emotionCache";
import { ReactNode } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { darkTheme, lightTheme } from "@/theme/theme"; // 👈 Importa tus temas

const clientSideEmotionCache = createEmotionCache();

interface ThemeRegistryProps {
  children: ReactNode;
}

export function ThemeRegistry({ children }: ThemeRegistryProps) {
  const { mode } = useThemeContext(); // 👈 Usamos tu contexto dinámico

  const theme = mode === "light" ? lightTheme : darkTheme; // 👈 Selecciona el tema correcto

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
