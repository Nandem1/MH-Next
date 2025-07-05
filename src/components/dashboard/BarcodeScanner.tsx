"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";

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
  const [lastScannedCode, setLastScannedCode] = useState<string>("");
  const [scanCount, setScanCount] = useState(0);
  const [lastScanTime, setLastScanTime] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !scannerRef.current || !isMounted) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let Quagga: any;

    const initializeScanner = async () => {
      try {
        // Verificar que estamos en el navegador
        if (typeof window === 'undefined') {
          throw new Error('Quagga solo funciona en el navegador');
        }

        // Importar Quagga dinámicamente solo en el cliente
        Quagga = (await import("quagga")).default;
        
        setIsInitializing(true);
        setError(null);

        Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: scannerRef.current,
              constraints: {
                width: { min: 640 },
                height: { min: 480 },
                facingMode: "environment", // Usar cámara trasera en móviles
              },
            },
            locator: {
              patchSize: "medium", // Volver a medium para mejor balance
              halfSample: true, // Reactivar para mejor rendimiento
            },
            numOfWorkers: 2, // Volver a 2 workers para mejor rendimiento
            frequency: 5, // Aumentar a 5 para mejor balance velocidad/precisión
            decoder: {
              readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "code_39_reader",
                "code_39_vin_reader",
                "codabar_reader",
                "upc_reader",
                "upc_e_reader",
                "i2of5_reader",
              ],
            },
            locate: true,
          },
          (err: Error | null) => {
            setIsInitializing(false);
            if (err) {
              console.error("Quagga init error:", err);
              const errorMessage = "Error al inicializar la cámara. Asegúrate de dar permisos de cámara.";
              setError(errorMessage);
              onError(errorMessage);
            }
          }
        );

        Quagga.start();

        Quagga.onDetected((result: { codeResult: { code: string; confidence: number } }) => {
          const code = result.codeResult.code;
          const confidence = result.codeResult.confidence;
          const currentTime = Date.now();
          
          // Validar que el código tenga al menos 8 caracteres y confianza moderada
          if (code && code.length >= 8 && confidence > 0.5) {
            // Verificar si es el mismo código que se leyó antes
            if (code === lastScannedCode) {
              // Si es el mismo código y han pasado al menos 500ms, procesar
              if (currentTime - lastScanTime > 500) {
                setScanCount(prev => prev + 1);
                setLastScanTime(currentTime);
                
                // Procesar después de la primera confirmación (no esperar 2 veces)
                if (scanCount >= 0) {
                  Quagga.stop();
                  onSuccess(code);
                  return;
                }
              }
            } else {
              // Nuevo código detectado, reiniciar contador
              setLastScannedCode(code);
              setScanCount(0);
              setLastScanTime(currentTime);
            }
          }
        });

        Quagga.onProcessed((result: { codeResult?: { code: string }; line?: Array<{ x: number; y: number }> }) => {
          if (result) {
            const drawingCanvas = Quagga.canvas.dom.overlay;
            const drawingCtx = drawingCanvas.getContext("2d");
            if (result.codeResult && result.codeResult.code && result.line && drawingCtx) {
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
      if (Quagga) {
        try {
          Quagga.stop();
        } catch (err) {
          console.error("Error stopping Quagga:", err);
        }
      }
    };
  }, [isClient, isMounted, onSuccess, onError, lastScannedCode, scanCount, lastScanTime]);

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
      
      {lastScannedCode && (
        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
          Código detectado: {lastScannedCode}
        </Typography>
      )}
    </Box>
  );
} 