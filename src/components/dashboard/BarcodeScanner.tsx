"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography, Alert, CircularProgress, Button, Stack } from "@mui/material";
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
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !scannerRef.current) return;

    let lastCode: string | null = null;
    let stableCount = 0;
    let watchdogTimer: NodeJS.Timeout | null = null;
    const REQUIRED = 3;
    const WATCHDOG_TIMEOUT = 10000; // 10s

    const startWatchdog = () => {
      if (watchdogTimer) clearTimeout(watchdogTimer);
      watchdogTimer = setTimeout(() => {
        console.log("Watchdog: reiniciando...");
        Quagga.stop();
        setTimeout(() => {
          Quagga.start();
          startWatchdog();
        }, 500);
      }, WATCHDOG_TIMEOUT);
    };

    const clearWatchdog = () => {
      if (watchdogTimer) clearTimeout(watchdogTimer);
    };

    const initializeScanner = async () => {
      try {
        if (typeof window === 'undefined') {
          throw new Error('Quagga solo funciona en el navegador');
        }

        setIsInitializing(true);
        setError(null);

        // Configuración de Quagga2
        await Quagga.init({
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: scannerRef.current!,
            constraints: {
              width: { min: 640 },
              height: { min: 480 },
              facingMode: 'environment',
            },
            area: {
              top: '25%', 
              right: '5%', 
              left: '5%', 
              bottom: '25%'
            },
          },
          locator: { 
            patchSize: 'small', 
            halfSample: true 
          },
          numOfWorkers: 4,
          frequency: 3,
          decoder: { 
            readers: ['ean_reader', 'code_128_reader'] 
          },
          locate: true,
        });

        setIsInitializing(false);
        startWatchdog();

        // Evento de detección
        Quagga.onDetected((result) => {
          if (isPaused) return;
          
          const { code } = result.codeResult;
          if (!code || code.length < 8) return;

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

        // Evento de procesamiento para dibujar líneas
        Quagga.onProcessed((result) => {
          if (result && result.line) {
            const canvas = Quagga.canvas.dom.overlay;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, ctx, { 
                color: 'green', 
                lineWidth: 3 
              });
            }
          }
        });

        // Iniciar el escáner
        await Quagga.start();

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
      Quagga.stop();
    };
  }, [isClient, onSuccess, onError, isPaused]);

  // Handler para reintentar escaneo
  const handleRestart = () => {
    setDetectedCode(null);
    setIsPaused(false);
    Quagga.start();
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

      {!detectedCode && !isInitializing && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Coloca el código dentro del recuadro verde
        </Typography>
      )}
    </Box>
  );
}

