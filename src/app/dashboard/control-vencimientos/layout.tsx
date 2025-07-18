import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Control de Vencimientos",
};

export default function ControlVencimientosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 