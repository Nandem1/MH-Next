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

        // Configuración de Quagga2
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const constraints: any = {
          width: { min: 1920 },
          height: { min: 1080 },
          facingMode: "environment",
          advanced: [
            {
              focusMode: "continuous",
              exposureMode: "continuous",
              whiteBalanceMode: "continuous",
            }
          ],
        };

        await Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current!,
            constraints,
            area: {
              top: "10%", 
              right: "10%", 
              left: "10%", 
              bottom: "10%"
            },
          },
          locator: {
            patchSize: "small",
            halfSample: false,
          },
          numOfWorkers: 4,
          frequency: 3,
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
            // Si empieza con "0", quitarlo
            const cleanCode = code.startsWith('0') ? code.substring(1) : code;
            
            Quagga.stop();
            onSuccess(cleanCode);
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
      >
        {/* Rectángulo de guía que coincide con el área de lectura de Quagga */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "80%",
            height: "80%",
            border: "2px solid #00ff00",
            borderRadius: 1,
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Apunta la cámara hacia el código de barras
      </Typography>
    </Box>
  );
}

