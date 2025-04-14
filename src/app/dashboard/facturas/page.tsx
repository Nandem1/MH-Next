import { LayoutDashboard } from "@/components/layout/LayoutDashboard";
import { FacturaPageContent } from "@/components/dashboard/FacturaPageContent";
import { Typography } from "@mui/material";

export default function FacturasPage() {
  return (
    <LayoutDashboard>
      <Typography variant="h4" gutterBottom>
        Facturas
      </Typography>
      <FacturaPageContent />
    </LayoutDashboard>
  );
}
