import { VencimientosPageContent } from "@/components/dashboard/VencimientosPageContent";
import { Box } from "@mui/material";

export default function VencimientosPage() {
  return (
    <Box sx={{ minHeight: "95vh", display: "flex", flexDirection: "column", mt: 8, px: { xs: 2, md: 3 } }}>
      <VencimientosPageContent />
    </Box>
  );
} 