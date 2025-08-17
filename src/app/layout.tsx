import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./theme-registry";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";
import SchemaData from "@/components/seo/SchemaData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Mercadohouse - Tu supermercado de confianza en La Serena/Coquimbo",
    template: "%s ⋮ Mercadohouse"
  },
  description: "Tu supermercado de confianza en La Serena y Coquimbo con más de 15 años sirviendo a la comunidad. Productos frescos, calidad y el mejor servicio en nuestros 3 locales: La Cantera, Las Compañías y Balmaceda.",
  keywords: "supermercado, mercadohouse, la serena, coquimbo, productos frescos, ofertas, la cantera, las compañías, balmaceda, chile",
  authors: [{ name: "Mercado House SPA" }],
  creator: "Mercado House SPA",
  publisher: "Mercado House SPA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Mercadohouse - Tu supermercado de confianza en La Serena/Coquimbo",
    description: "Tu supermercado de confianza en La Serena y Coquimbo con más de 15 años sirviendo a la comunidad. Productos frescos, calidad y el mejor servicio.",
    url: '/',
    siteName: 'Mercadohouse',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Mercadohouse - Supermercado La Serena Coquimbo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mercadohouse - Tu supermercado de confianza en La Serena/Coquimbo",
    description: "Tu supermercado de confianza en La Serena y Coquimbo con más de 15 años sirviendo a la comunidad. Productos frescos, calidad y el mejor servicio.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <SchemaData />
      </head>
      <body className={inter.className}>
        <ThemeRegistry>
          <AuthProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
