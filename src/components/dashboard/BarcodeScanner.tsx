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
  const [isLiveStreamFailed, setIsLiveStreamFailed] = useState(false);
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !scannerRef.current || !isMounted) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let Quagga: any;
    let lastCode: string | null = null;
    let stableCount = 0;
    let watchdogTimer: NodeJS.Timeout | null = null;
    let restartTimer: NodeJS.Timeout | null = null;
    const THRESHOLD = 0.6;
    const REQUIRED = 3;
    const WATCHDOG_TIMEOUT = 10000; // 10 segundos

    const startWatchdog = () => {
      // Limpiar watchdog anterior si existe
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
      }
      
      // Iniciar nuevo watchdog
      watchdogTimer = setTimeout(() => {
        console.log("Watchdog: Reiniciando Quagga por timeout");
        if (Quagga) {
          try {
            Quagga.stop();
            setTimeout(() => {
              Quagga.start();
              startWatchdog(); // Reiniciar watchdog después del restart
            }, 500); // Pequeño delay antes de reiniciar
          } catch (err) {
            console.error("Error restarting Quagga:", err);
          }
        }
      }, WATCHDOG_TIMEOUT);
    };

    const clearWatchdog = () => {
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
        watchdogTimer = null;
      }
    };

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
                // Asegurar autofocus activo
                advanced: {
                  focusMode: "continuous",
                  exposureMode: "continuous",
                  whiteBalanceMode: "continuous",
                },
              },
              area: {    // Región de interés - solo procesa el área central
                top:    "25%",
                right:  "5%",
                left:   "5%",
                bottom: "25%",
              },
            },
            locator: {
              patchSize: "small", // Buscar patrones finos
              halfSample: true, // Acelerar preprocesado
            },
            numOfWorkers: 4, // Mantener 4 workers para mejor rendimiento
            frequency: 3, // Solo 3 intentos por segundo - más tiempo para enfocar
            decoder: {
              readers: [
                "ean_reader",      // EAN-13 (13 dígitos) - formato más común
                "code_128_reader", // Code 128 (alfanumérico) - formato versátil
                // Eliminados readers innecesarios: codabar_reader, i2of5_reader, etc.
              ],
            },
            locate: true,
          },
          (err: Error | null) => {
            setIsInitializing(false);
            if (err) {
              console.error("Quagga init error:", err);
              setIsLiveStreamFailed(true);
              const errorMessage = "Error al inicializar la cámara. Asegúrate de dar permisos de cámara.";
              setError(errorMessage);
              onError(errorMessage);
            } else {
              // Iniciar watchdog después de inicialización exitosa
              startWatchdog();
            }
          }
        );

        Quagga.start();

        Quagga.onDetected((result: { codeResult: { code: string; confidence: number } }) => {
          // Si está pausado, no procesar detecciones
          if (isPaused) return;
          
          const { code, confidence } = result.codeResult;
          
          // Solo procesar códigos con longitud mínima y confianza alta
          if (!code || code.length < 8 || confidence < THRESHOLD) return;

          if (code === lastCode) {
            stableCount++;
          } else {
            lastCode = code;
            stableCount = 1;
          }

          if (stableCount >= REQUIRED) {
            clearWatchdog(); // Limpiar watchdog al detectar código válido
            
            console.log("🎯 Código detectado:", code);
            
            // Pausar la detección temporalmente (mantener cámara activa)
            setIsPaused(true);
            setDetectedCode(code);
            
            // Procesar el código exitosamente
            onSuccess(code);
            
            // Reanudar la detección después de 2 segundos
            restartTimer = setTimeout(() => {
              setDetectedCode(null); // Limpiar el código detectado
              setIsPaused(false); // Reanudar detección
              startWatchdog(); // Reiniciar watchdog
            }, 2000);
          } else {
            // Reiniciar watchdog en cada detección válida
            startWatchdog();
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

        // Manejar errores del live stream
        Quagga.onProcessed((result: { codeResult?: { code: string } }) => {
          if (result && result.codeResult && result.codeResult.code) {
            // Si hay detección, el live stream funciona
            setIsLiveStreamFailed(false);
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
      clearWatchdog(); // Limpiar watchdog al desmontar
      if (restartTimer) {
        clearTimeout(restartTimer);
      }
      if (Quagga) {
        try {
          Quagga.stop();
        } catch (err) {
          console.error("Error stopping Quagga:", err);
        }
      }
    };
  }, [isClient, isMounted, onSuccess, onError, isPaused]);

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

  // Si se detectó un código, mostrar confirmación
  if (detectedCode) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="h6" color="success.main">
            ¡Código detectado!
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, fontFamily: "monospace", fontSize: "1.2rem" }}>
            {detectedCode}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            El código ha sido agregado al formulario. Puedes cerrar esta ventana.
          </Typography>
        </Alert>
      </Box>
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
        sx={{
          width: "100%",
          height: "300px",
          border: "2px solid #ccc",
          borderRadius: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Contenedor de la cámara */}
        <Box
          ref={scannerRef}
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        />
        
        {/* Rectángulo de guía centrado */}
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            left: "25%",
            width: "50%",
            height: "50%",
            border: "3px solid #00ff00",
            borderRadius: 1,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.3)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {/* Esquinas del rectángulo */}
          <Box
            sx={{
              position: "absolute",
              top: "-3px",
              left: "-3px",
              width: "20px",
              height: "20px",
              borderTop: "3px solid #00ff00",
              borderLeft: "3px solid #00ff00",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "-3px",
              right: "-3px",
              width: "20px",
              height: "20px",
              borderTop: "3px solid #00ff00",
              borderRight: "3px solid #00ff00",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "-3px",
              left: "-3px",
              width: "20px",
              height: "20px",
              borderBottom: "3px solid #00ff00",
              borderLeft: "3px solid #00ff00",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "-3px",
              right: "-3px",
              width: "20px",
              height: "20px",
              borderBottom: "3px solid #00ff00",
              borderRight: "3px solid #00ff00",
            }}
          />
        </Box>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Coloca el código de barras dentro del rectángulo verde
      </Typography>
      
      {isLiveStreamFailed && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Modo de compatibilidad activado. El escáner puede ser más lento.
          </Typography>
        </Alert>
      )}
    </Box>
  );
} 