import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mercado House",
};

export default function DashboardPage() {
  redirect("/login");
}
