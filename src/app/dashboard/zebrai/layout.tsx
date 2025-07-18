import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZebrAI",
};

export default function ZebrAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 