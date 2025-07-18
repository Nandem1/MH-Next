import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeRegistry } from "@/providers/ThemeRegistry";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/context/AuthContext"; // 👈 importar el nuevo contexto
import { Inter } from "next/font/google";
import { CssBaseline } from "@mui/material";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Mercado House",
    template: "%s ⋮ Mercado House"
  },
  description: "Sistema de gestión de facturas y documentos electrónicos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {" "}
            {/* ✅ Ahora tu contexto está activo */}
            <ThemeRegistry>
              <QueryProvider>
                <CssBaseline />
                {children}
                <SpeedInsights />
                <Analytics />
              </QueryProvider>
            </ThemeRegistry>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
