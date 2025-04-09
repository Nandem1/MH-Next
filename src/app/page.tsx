// src/app/page.tsx
import { FacturaTable } from "@/components/dashboard/FacturaTable";
import { ButtonToggleTheme } from "@/components/ui/ButtonToggleTheme";

export default function HomePage() {
  return (
    <main>
      <h1>Dashboard de Facturas</h1>
      <ButtonToggleTheme  />
      <FacturaTable />
    </main>
  );
}
