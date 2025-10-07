import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ingreso de Factura",
};

export default function IngresoFacturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
