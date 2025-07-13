"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: "card" | "modal" | "thumbnail";
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 75,
  sizes,
  className,
  style,
  variant = "card",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Configuraciones por defecto según el variant
  const getDefaultConfig = () => {
    switch (variant) {
      case "card":
        return {
          sizes: sizes || "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw",
          quality: 75,
          priority: false,
        };
      case "modal":
        return {
          sizes: sizes || "(max-width: 600px) 100vw, (max-width: 1200px) 80vw, 800px",
          quality: 85,
          priority: true,
        };
      case "thumbnail":
        return {
          sizes: sizes || "(max-width: 600px) 100vw, (max-width: 1200px) 25vw, 20vw",
          quality: 60,
          priority: false,
        };
      default:
        return {
          sizes: sizes || "100vw",
          quality: 75,
          priority: false,
        };
    }
  };

  const config = getDefaultConfig();

  if (hasError) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
          color: "grey.500",
          fontSize: "0.875rem",
          ...(fill && { position: "absolute", inset: 0 }),
          ...(width && height && { width, height }),
        }}
      >
        Error al cargar imagen
      </Box>
    );
  }

  return (
    <>
      {isLoading && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            ...(fill && { position: "absolute", inset: 0 }),
            ...(width && height && { width, height }),
          }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority || config.priority}
        quality={quality || config.quality}
        sizes={sizes || config.sizes}
        className={className}
        style={{
          ...style,
          objectFit: "cover",
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </>
  );
} 