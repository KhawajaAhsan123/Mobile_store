import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackText?: string;
  width?: number;
  height?: number;
  className?: string;
}

const ImageWithFallback = ({ 
  src, 
  alt, 
  fallbackText = 'Image', 
  width = 300, 
  height = 300, 
  className = '' 
}: ImageWithFallbackProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (!imgError) {
      setImgError(true);
      // Generate a placeholder SVG
      const svgContent = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="hsl(var(--muted))"/>
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="hsl(var(--muted-foreground))" text-anchor="middle" dy=".3em">
            ${fallbackText}
          </text>
        </svg>
      `;
      setImgSrc(`data:image/svg+xml;base64,${btoa(svgContent)}`);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
