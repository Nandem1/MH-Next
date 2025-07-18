import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
};

export default function InicioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 