"use client";

import { ReactNode } from "react";
import { LayoutDashboard } from "@/components/layout/LayoutDashboard"; // 👈 Este archivo tú ya lo tienes

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutDashboard>
      {children}
    </LayoutDashboard>
  );
}
