"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";

interface BarcodeScannerProps {
  onSuccess: (result: string) => void;
  onError: (error: string) => void;
}

interface ScanResult {
  code: string;
  confidence: number;
  timestamp: number;
}

export function BarcodeScanner({ onSuccess, onError }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [quaggaAvailable, setQuaggaAvailable] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [currentCode, setCurrentCode] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !scannerRef.current || !isMounted) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let Quagga: any;
    let scanTimeout: NodeJS.Timeout;

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
              patchSize: "medium",
              halfSample: false,
            },
            numOfWorkers: 4,
            frequency: 8, // Reducir ligeramente de 10 a 8 para mejor precisión
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
          
          if (code && code.length >= 8 && confidence > 0.3) {
            // Si es un nuevo código, iniciar proceso de escaneo múltiple
            if (code !== currentCode) {
              setCurrentCode(code);
              setScanResults([]);
              setIsScanning(true);
              
              // Limpiar timeout anterior si existe
              if (scanTimeout) {
                clearTimeout(scanTimeout);
              }
              
              // Establecer timeout para procesar después de 2 segundos
              scanTimeout = setTimeout(() => {
                processScanResults();
              }, 2000);
            }
            
            // Agregar resultado al array
            setScanResults(prev => [...prev, {
              code,
              confidence,
              timestamp: Date.now()
            }]);
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

        const processScanResults = () => {
          if (scanResults.length === 0) {
            setIsScanning(false);
            setCurrentCode("");
            return;
          }

          // Agrupar resultados por código (por si hay variaciones menores)
          const codeGroups = new Map<string, ScanResult[]>();
          
          scanResults.forEach(result => {
            const normalizedCode = result.code.trim();
            if (!codeGroups.has(normalizedCode)) {
              codeGroups.set(normalizedCode, []);
            }
            codeGroups.get(normalizedCode)!.push(result);
          });

          // Encontrar el grupo con más lecturas y mayor confianza promedio
          let bestCode = "";
          let bestConfidence = 0;
          let bestCount = 0;

          codeGroups.forEach((results, code) => {
            const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
            const count = results.length;

            // Priorizar códigos con más lecturas y mayor confianza
            if (count > bestCount || (count === bestCount && avgConfidence > bestConfidence)) {
              bestCode = code;
              bestConfidence = avgConfidence;
              bestCount = count;
            }
          });

          // Solo procesar si tenemos al menos 2 lecturas del mismo código
          if (bestCount >= 2) {
            Quagga.stop();
            onSuccess(bestCode);
          } else {
            // Si no hay suficientes lecturas, continuar escaneando
            setIsScanning(false);
            setCurrentCode("");
            setScanResults([]);
          }
        };

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
      if (scanTimeout) {
        clearTimeout(scanTimeout);
      }
      if (Quagga) {
        try {
          Quagga.stop();
        } catch (err) {
          console.error("Error stopping Quagga:", err);
        }
      }
    };
  }, [isClient, isMounted, onSuccess, onError, currentCode, scanResults]);

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
      
      {isScanning && currentCode && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="primary">
            Código detectado: {currentCode}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lecturas: {scanResults.length} - Procesando...
          </Typography>
        </Box>
      )}
    </Box>
  );
} 