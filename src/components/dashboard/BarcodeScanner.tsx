"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography, Alert, CircularProgress, Button, Stack } from "@mui/material";

interface BarcodeScannerProps {
  onSuccess: (result: string) => void;
  onError: (error: string) => void;
}

// Tipo para Quagga
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface QuaggaType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init: (config: any, callback: (err: Error | null) => void) => void;
  start: () => void;
  stop: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDetected: (callback: (result: any) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onProcessed: (callback: (result: any) => void) => void;
  offDetected: () => void;
  offProcessed: () => void;
  canvas: {
    dom: {
      overlay: HTMLCanvasElement;
    };
  };
  ImageDebug: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    drawPath: (line: any, coords: any, ctx: CanvasRenderingContext2D, options: any) => void;
  };
}

export function BarcodeScanner({ onSuccess, onError }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const quaggaRef = useRef<QuaggaType | null>(null);
  const startWatchdogRef = useRef<(() => void) | undefined>(undefined);

  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiveStreamFailed, setIsLiveStreamFailed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !scannerRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let Quagga: any;
    let lastCode: string | null = null;
    let stableCount = 0;
    let watchdogTimer: NodeJS.Timeout | null = null;
    const THRESHOLD = 0.6;
    const REQUIRED = 3;
    const WATCHDOG_TIMEOUT = 10000; // 10s

    const startWatchdog = () => {
      if (watchdogTimer) clearTimeout(watchdogTimer);
      watchdogTimer = setTimeout(() => {
        console.log("Watchdog: reiniciando...");
        if (quaggaRef.current) {
          quaggaRef.current.stop();
          setTimeout(() => {
            quaggaRef.current?.start();
            startWatchdog();
          }, 500);
        }
      }, WATCHDOG_TIMEOUT);
    };

    startWatchdogRef.current = startWatchdog;

    const clearWatchdog = () => {
      if (watchdogTimer) clearTimeout(watchdogTimer);
    };

    const initializeScanner = async () => {
      try {
        if (typeof window === 'undefined') {
          throw new Error('Quagga solo funciona en el navegador');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Quagga = (await import('quagga')).default;
        quaggaRef.current = Quagga;

        // detach previous handlers
        Quagga.offDetected();
        Quagga.offProcessed();

        setIsInitializing(true);
        setError(null);

        Quagga.init({
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: scannerRef.current!,
            constraints: {
              width: { min: 640 },
              height: { min: 480 },
              facingMode: 'environment',
              advanced: [
                { focusMode: 'continuous' },
                { exposureMode: 'continuous' },
                { whiteBalanceMode: 'continuous' },
              ],
            },
            area: {
              top: '25%', right: '5%', left: '5%', bottom: '25%'
            },
          },
          locator: { patchSize: 'small', halfSample: true },
          numOfWorkers: 4,
          frequency: 3,
          decoder: { readers: ['ean_reader', 'code_128_reader'] },
          locate: true,
        }, (err: Error | null) => {
          setIsInitializing(false);
          if (err) {
            console.error('Init error:', err);
            setError('Error al inicializar la cámara.');
            onError('Error al inicializar la cámara.');
            setIsLiveStreamFailed(true);
          } else {
            startWatchdog();
          }
        });

        Quagga.start();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Quagga.onDetected((result: any) => {
          if (isPaused) return;
          const { code, confidence } = result.codeResult;
          if (!code || code.length < 8 || confidence < THRESHOLD) return;

          if (code === lastCode) {
            stableCount++;
          } else {
            lastCode = code;
            stableCount = 1;
          }

          if (stableCount >= REQUIRED) {
            clearWatchdog();
            console.log('Detected:', code);
            setIsPaused(true);
            setDetectedCode(code);
            onSuccess(code);
          } else {
            startWatchdog();
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Quagga.onProcessed((result: any) => {
          if (result && result.line) {
            const canvas = Quagga.canvas.dom.overlay;
            const ctx = canvas.getContext('2d');
            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, ctx, { color: 'green', lineWidth: 3 });
          }
        });

      } catch (err) {
        console.error('Load error:', err);
        setError('Error al cargar el escáner.');
        onError('Error al cargar el escáner.');
        setIsInitializing(false);
      }
    };

    const timer = setTimeout(initializeScanner, 100);
    return () => {
      clearTimeout(timer);
      clearWatchdog();
      if (quaggaRef.current) {
        Quagga.offDetected();
        Quagga.offProcessed();
        quaggaRef.current.stop();
      }
    };
  }, [isClient, onSuccess, onError, isPaused]);

  // Handler para reintentar escaneo
  const handleRestart = () => {
    setDetectedCode(null);
    setIsPaused(false);
    quaggaRef.current?.start();
    startWatchdogRef.current?.();
  };

  if (!isMounted) return null;
  if (!isClient) {
    return (
      <Box textAlign="center">
        <CircularProgress size={40} />
        <Typography variant="body2" mt={1}>Cargando escáner...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
      <Box ref={scannerRef} sx={{ width: '100%', height: '100%' }} />

      {/* Guía visual */}
      <Box
        sx={{
          position: 'absolute', top: '25%', left: '25%', width: '50%', height: '50%',
          border: '2px dashed #0f0', pointerEvents: 'none', zIndex: 10
        }}
      />

      {/* Mensaje de detección */}
      {detectedCode && (
        <Box
          sx={{
            position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Alert severity="success">Código detectado: {detectedCode}</Alert>
            <Button variant="contained" onClick={handleRestart}>Escanear de nuevo</Button>
          </Stack>
        </Box>
      )}

      {isInitializing && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
          <CircularProgress size={40} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      )}

      {isLiveStreamFailed && !error && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Modo compatibilidad activado. Puede ser más lento.
        </Alert>
      )}

      {!detectedCode && !isInitializing && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Coloca el código dentro del recuadro verde
        </Typography>
      )}
    </Box>
  );
}
