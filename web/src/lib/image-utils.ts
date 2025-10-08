// This file should only be used on the server-side
// Image processing utilities for server-side use only

import sharp from 'sharp';

// Industry standard image size limits
export const IMAGE_LIMITS = {
  // Brand logos: 512x512px max, 2MB max file size
  BRAND_LOGO: {
    maxWidth: 512,
    maxHeight: 512,
    maxFileSize: 2 * 1024 * 1024, // 2MB
    quality: 85,
    format: 'webp' as const
  },
  // Product images: 1024x1024px max, 5MB max file size
  PRODUCT_IMAGE: {
    maxWidth: 1024,
    maxHeight: 1024,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    quality: 80,
    format: 'webp' as const
  }
};

export interface ImageProcessingResult {
  buffer: Buffer;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  format: string;
}

export async function processImage(
  file: File,
  type: 'brand' | 'product' = 'product'
): Promise<ImageProcessingResult> {
  const limits = type === 'brand' ? IMAGE_LIMITS.BRAND_LOGO : IMAGE_LIMITS.PRODUCT_IMAGE;
  
  // Check file size
  if (file.size > limits.maxFileSize) {
    throw new Error(`File size too large. Maximum allowed: ${limits.maxFileSize / (1024 * 1024)}MB`);
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, SVG, and WebP images are allowed.');
  }

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const originalSize = buffer.length;

  // Handle SVG files differently
  if (file.type === 'image/svg+xml') {
    return await processSVG(buffer);
  }

  // Process raster images with Sharp
  const sharpInstance = sharp(buffer);
  const metadata = await sharpInstance.metadata();
  
  // Resize if needed
  let resized = sharpInstance;
  if (metadata.width && metadata.height) {
    if (metadata.width > limits.maxWidth || metadata.height > limits.maxHeight) {
      resized = sharpInstance.resize(limits.maxWidth, limits.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
  }

  // Compress and convert to WebP
  const processedBuffer = await resized
    .webp({ quality: limits.quality })
    .toBuffer();

  const processedMetadata = await sharp(processedBuffer).metadata();

  return {
    buffer: processedBuffer,
    originalSize,
    compressedSize: processedBuffer.length,
    width: processedMetadata.width || 0,
    height: processedMetadata.height || 0,
    format: 'webp'
  };
}

async function processSVG(buffer: Buffer): Promise<ImageProcessingResult> {
  // For SVG, we'll just validate and return the original
  // In a real implementation, you might want to use SVGO for optimization
  const originalSize = buffer.length;
  
  // Basic SVG validation
  const svgContent = buffer.toString('utf-8');
  if (!svgContent.includes('<svg')) {
    throw new Error('Invalid SVG file');
  }

  // Simple SVG optimization (remove extra whitespace)
  const optimizedSvg = svgContent
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();

  const optimizedBuffer = Buffer.from(optimizedSvg, 'utf-8');

  return {
    buffer: optimizedBuffer,
    originalSize,
    compressedSize: optimizedBuffer.length,
    width: 0, // SVG width is dynamic
    height: 0, // SVG height is dynamic
    format: 'svg'
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getCompressionRatio(originalSize: number, compressedSize: number): number {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}
