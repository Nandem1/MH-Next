import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración",
};

export default function ConfiguracionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 