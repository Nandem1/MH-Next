"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import Quagga from "@ericblade/quagga2";

interface BarcodeScannerProps {
  onSuccess: (result: string) => void;
  onError: (error: string) => void;
}

export function BarcodeScanner({ onSuccess, onError }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [quaggaAvailable, setQuaggaAvailable] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !scannerRef.current || !isMounted) return;

    const initializeScanner = async () => {
      try {
        // Verificar que estamos en el navegador
        if (typeof window === 'undefined') {
          throw new Error('Quagga solo funciona en el navegador');
        }

        setIsInitializing(true);
        setError(null);

        await Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current!,
            constraints: {
              width: { min: 1280 },
              height: { min: 720 },
              facingMode: "environment", // Usar cámara trasera en móviles
            },
          },
          locator: {
            patchSize: "small",
            halfSample: false, // Mantener resolución completa
          },
          numOfWorkers: 4, // Mantener 4 workers para mejor rendimiento
          frequency: 3, // Reducir a 6 para mejor precisión sin ser muy lento
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
            ],
          },
          locate: true,
        });

        setIsInitializing(false);

        await Quagga.start();

        Quagga.onDetected((result) => {
          const code = result.codeResult.code;
          
          // Validación simple pero efectiva
          if (code && code.length >= 8) {
            // Filtrar el "0" al inicio que es un problema común
            let cleanCode = code;
            
            // Si empieza con "0" y tiene más de 8 dígitos, remover el primer "0"
            if (code.startsWith('0') && code.length > 8) {
              cleanCode = code.substring(1);
              console.log('Código original:', code, 'Código limpio:', cleanCode);
            }
            
            // Validación adicional: asegurar que el código limpio tenga al menos 8 caracteres
            if (cleanCode.length >= 8) {
              Quagga.stop();
              onSuccess(cleanCode);
            }
          }
        });

        Quagga.onProcessed((result) => {
          if (result && result.line) {
            const drawingCanvas = Quagga.canvas.dom.overlay;
            const drawingCtx = drawingCanvas.getContext("2d");
            if (drawingCtx) {
              Quagga.ImageDebug.drawPath(result.line, { x: "x", y: "y" }, drawingCtx, {
                color: "green",
                lineWidth: 5,
              });
            }
          }
        });

      } catch (err) {
        console.error("Error loading Quagga:", err);
        setQuaggaAvailable(false);
        const errorMessage = "Error al cargar el escáner de códigos de barras.";
        setError(errorMessage);
        onError(errorMessage);
        setIsInitializing(false);
      }
    };

    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      initializeScanner();
    }, 100);

    return () => {
      clearTimeout(timer);
      try {
        Quagga.stop();
      } catch (err) {
        console.error("Error stopping Quagga:", err);
      }
    };
  }, [isClient, isMounted, onSuccess, onError]);

  // No renderizar nada hasta que esté montado
  if (!isMounted) {
    return null;
  }

  if (!isClient) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Cargando escáner...
        </Typography>
      </Box>
    );
  }

  if (error && !quaggaAvailable) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            El escáner de códigos de barras no está disponible en este navegador.
          </Typography>
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Por favor, ingresa el código de barras manualmente.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ textAlign: "center" }}>
      {isInitializing && (
        <Box sx={{ mb: 2 }}>
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Inicializando cámara...
          </Typography>
        </Box>
      )}
      
      <Box
        ref={scannerRef}
        sx={{
          width: "100%",
          height: "300px",
          border: "2px solid #ccc",
          borderRadius: 1,
          overflow: "hidden",
          position: "relative",
        }}
      />
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Apunta la cámara hacia el código de barras
      </Typography>
    </Box>
  );
}

