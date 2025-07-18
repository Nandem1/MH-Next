import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Facturas Electrónicas",
};

export default function FacturasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 