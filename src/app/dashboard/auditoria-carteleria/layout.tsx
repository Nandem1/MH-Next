import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auditoría de Cartelería",
};

export default function AuditoriaCarteleriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 