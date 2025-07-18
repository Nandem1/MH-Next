import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nóminas",
};

export default function NominasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 