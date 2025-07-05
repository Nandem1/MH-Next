declare module 'quagga' {
  interface QuaggaConfig {
    inputStream: {
      name: string;
      type: string;
      target: HTMLElement;
      constraints: {
        width: { min: number };
        height: { min: number };
        facingMode: string;
      };
    };
    locator: {
      patchSize: string;
      halfSample: boolean;
    };
    numOfWorkers: number;
    frequency: number;
    decoder: {
      readers: string[];
    };
    locate: boolean;
  }

  interface QuaggaResult {
    codeResult: {
      code: string;
      format: string;
    };
    line: Array<{ x: number; y: number }>;
  }

  interface QuaggaProcessedResult {
    codeResult?: {
      code: string;
      format: string;
    };
    line?: Array<{ x: number; y: number }>;
  }

  interface QuaggaStatic {
    init(config: QuaggaConfig, callback: (err: Error | null) => void): void;
    start(): void;
    stop(): void;
    onDetected(callback: (result: QuaggaResult) => void): void;
    onProcessed(callback: (result: QuaggaProcessedResult) => void): void;
    canvas: {
      dom: {
        overlay: HTMLCanvasElement;
      };
    };
    ImageDebug: {
      drawPath(path: Array<{ x: number; y: number }>, options: { x: string; y: string }, ctx: CanvasRenderingContext2D, style: { color: string; lineWidth: number }): void;
    };
  }

  const Quagga: QuaggaStatic;
  export = Quagga;
} 