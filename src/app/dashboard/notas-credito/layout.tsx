import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notas de Crédito",
};

export default function NotasCreditoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 