import { FacturaTable } from "@/components/dashboard/FacturaTable";
import { Typography } from "@mui/material";

export default function FacturasPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Facturas
      </Typography>
      <FacturaTable />
    </>
  );
}
