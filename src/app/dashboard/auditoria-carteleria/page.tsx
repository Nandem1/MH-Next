import { CarteleriaPageContent } from "@/components/dashboard/CarteleriaPageContent";
import { Box } from "@mui/material";

export default function AuditoriaCarteleriaPage() {
  return (
    <Box sx={{ minHeight: "95vh", display: "flex", flexDirection: "column", mt: 8, px: { xs: 2, md: 3 } }}>
      <CarteleriaPageContent />
    </Box>
  );
}
