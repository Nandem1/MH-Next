// src/app/page.tsx
import { FacturaTable } from "@/components/dashboard/FacturaTable";
import { ButtonToggleTheme } from "@/components/ui/ButtonToggleTheme";

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard de Facturas</h1>
      <ButtonToggleTheme  />
      <FacturaTable />
    </main>
  );
}
