"use client";

import { Box, Button, Typography, TextField, Grid, Card, CardContent, CardMedia } from "@mui/material";


import { useState } from "react";


export function ZebrAIGenerator() {
  const [barcode, setBarcode] = useState("");
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!barcode.trim()) return;

    try {
      setLoading(true);

      const zpl = `
CT~~CD,~CC^~CT~
^XA
~TA000
~JSN
^LT0
^MNN
^PON
^PMN
^LH0,0
^JMA
^PR6,6
~SD15
^JUS
^LRN
^CI27
^PA0,1,1,0
^XZ
^XA
^MMT
^PW807
^LL256
^LS0
^FT0,37^A0N,25,25^FB390,1,6,C^FH\\^CI28^FDESTUCHE CREMAS DOVE^FS^CI27
^FT0,62^A0N,25,25^FB390,1,6,C^FH\\^CI28^FDX2 75 ML - 5010^FS^CI27
^FT39,202^A0N,149,150^FH\\^CI28^FD4890^FS^CI27
^FT8,199^A0N,25,25^FH\\^CI28^FD$^FS^CI27
^FT7,237^A0N,17,18^FH\\^CI28^FDCOD. ITEM: 482270^FS^CI27
^FT415,37^A0N,25,25^FB392,1,6,C^FH\\^CI28^FDESTUCHE CREMAS DOVE^FS^CI27
^FT415,62^A0N,25,25^FB392,1,6,C^FH\\^CI28^FDX2 75 ML - 5010^FS^CI27
^FT455,202^A0N,149,150^FH\\^CI28^FD4890^FS^CI27
^FT424,199^A0N,25,25^FH\\^CI28^FD$^FS^CI27
^FT423,237^A0N,17,18^FH\\^CI28^FDCOD. ITEM: 482270^FS^CI27
^PQ1,0,1,Y
^XZ
      `; // tu ZPL completo aquí

      const response = await fetch("/api/zebra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zpl }),
      });

      if (!response.ok) throw new Error(`Respuesta no OK: ${response.status}`);

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      setImagenes([imageUrl, imageUrl, imageUrl]);
    } catch (error) {
      console.error("Error generando etiqueta:", error);
      setImagenes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        ZebrAI Generator
      </Typography>

      <Box sx={{ maxWidth: 400, mb: 2 }}>
        <TextField
          label="Código de Barras"
          variant="outlined"
          fullWidth
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generando..." : "Generar Etiquetas"}
        </Button>
      </Box>

      <Grid container spacing={2}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card
              sx={{
                height: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "background.paper",
                border: "1px dashed",
                borderColor: "divider",
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {imagenes[index] ? (
                  <CardMedia
                    component="img"
                    height="250"
                    image={imagenes[index]}
                    alt={`Etiqueta ${index + 1}`}
                    sx={{ objectFit: "contain", p: 2 }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aquí se previsualizará la etiqueta generada
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
