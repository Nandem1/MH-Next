"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeRegistry } from "@/providers/ThemeRegistry";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { CssBaseline } from "@mui/material";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthProvider>
          <ThemeRegistry>
            <QueryProvider>
              <CssBaseline />
              {children}
              <Analytics />
            </QueryProvider>
          </ThemeRegistry>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 