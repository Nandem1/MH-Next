"use client";

import { QueryProvider } from "@/providers/QueryProvider";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext"; // Cambió aquí
import { CssBaseline } from "@mui/material";
import { ThemeRegistry } from "@/providers/ThemeRegistry";
import { lightTheme } from "@/theme/theme"; 

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry theme={lightTheme}>
          <QueryProvider>
            <ThemeProvider>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </QueryProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
