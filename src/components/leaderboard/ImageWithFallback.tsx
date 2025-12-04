/**
 * ImageWithFallback Component
 * Displays an image with automatic fallback to default image on error
 */

import { DEFAULT_NFT_IMAGE } from "@/constants/leaderboard";

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
};

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc = DEFAULT_NFT_IMAGE,
  style,
  onError,
}: ImageWithFallbackProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (!target.src.includes(fallbackSrc)) {
      target.src = fallbackSrc;
    }
    onError?.(e);
  };

  return (
    <img
      alt={alt}
      className={className}
      src={src || fallbackSrc}
      onError={handleError}
      style={style}
    />
  );
}

