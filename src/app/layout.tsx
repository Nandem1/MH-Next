import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeRegistry } from "@/providers/ThemeRegistry";
import { QueryProvider } from "@/providers/QueryProvider";
import { Inter } from "next/font/google";
import { CssBaseline } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider> {/* Este va primero 🔥 */}
          <ThemeRegistry> {/* Ahora sí puede leer el contexto */}
            <QueryProvider>
              <CssBaseline />
              {children}
            </QueryProvider>
          </ThemeRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}