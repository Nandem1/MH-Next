"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useState, useEffect, useRef } from "react";
import { useResponsive } from "@/hooks/useResponsive";

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
  lazy?: boolean;
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
  lazy = true,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imageRef = useRef<HTMLDivElement>(null);
  const isMobile = useResponsive("(max-width: 768px)");

  // Configuraciones optimizadas por variant y dispositivo
  const getDefaultConfig = () => {
    const baseConfig = {
      card: {
        desktop: {
          sizes: "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw",
          quality: 60,
          priority: false,
        },
        mobile: {
          sizes: "(max-width: 768px) 100vw",
          quality: 40, // Calidad muy baja para mobile
          priority: false,
        },
      },
      modal: {
        desktop: {
          sizes: "(max-width: 600px) 100vw, (max-width: 1200px) 80vw, 800px",
          quality: 80,
          priority: true,
        },
        mobile: {
          sizes: "(max-width: 768px) 100vw",
          quality: 60, // Calidad media para modales en mobile
          priority: true,
        },
      },
      thumbnail: {
        desktop: {
          sizes: "(max-width: 600px) 100vw, (max-width: 1200px) 25vw, 20vw",
          quality: 50,
          priority: false,
        },
        mobile: {
          sizes: "(max-width: 768px) 100vw",
          quality: 30, // Calidad muy baja para thumbnails en mobile
          priority: false,
        },
      },
    };

    const deviceConfig = isMobile ? 'mobile' : 'desktop';
    const variantConfig = baseConfig[variant][deviceConfig];

    return {
      sizes: sizes || variantConfig.sizes,
      quality: quality || variantConfig.quality,
      priority: priority || variantConfig.priority,
      placeholder: "blur",
      blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
    };
  };

  const config = getDefaultConfig();

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!lazy || !imageRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: isMobile ? "50px" : "100px", // Más agresivo en mobile
        threshold: 0.1,
      }
    );

    observer.observe(imageRef.current);

    return () => observer.disconnect();
  }, [lazy, isMobile]);

  // Preload de imagen crítica
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src]);

  if (hasError) {
    return (
      <Box
        ref={imageRef}
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
    <Box ref={imageRef}>
      {isLoading && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            ...(fill && { position: "absolute", inset: 0 }),
            ...(width && height && { width, height }),
            bgcolor: 'grey.200',
          }}
        />
      )}
      {isInView && (
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
          placeholder="blur"
          blurDataURL={config.blurDataURL}
          style={{
            ...style,
            objectFit: "cover",
            // Optimizaciones específicas para mobile
            ...(isMobile && {
              imageRendering: '-webkit-optimize-contrast',
            }),
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          loading={lazy ? "lazy" : "eager"}
          // Forzar formatos modernos en mobile
          {...(isMobile && {
            unoptimized: false,
          })}
        />
      )}
    </Box>
  );
} 