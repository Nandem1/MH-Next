import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rinde Gastos",
};

export default function RindeGastosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
