import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lector DTE",
};

export default function LectorDTELayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 