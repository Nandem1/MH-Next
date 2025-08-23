"use client";

import { Box, Paper } from "@mui/material";
import { RindeGastosContent } from "@/components/dashboard/RindeGastosContent";

export default function RindeGastosPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      <Box sx={{ flexGrow: 1, mt: 12, px: { xs: 3, md: 4 }, pb: 3 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            border: 1, 
            borderColor: "divider",
            borderRadius: 1.5,
            overflow: "hidden",
            minHeight: "calc(100vh - 140px)",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Box sx={{ 
            p: { xs: 3, md: 4 },
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
            <RindeGastosContent />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
