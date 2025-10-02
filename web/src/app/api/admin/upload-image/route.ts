import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const type = formData.get('type') as 'brand' | 'product';

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    if (!type || !['brand', 'product'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid image type. Must be "brand" or "product"' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, SVG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Set size limits based on type
    const limits = {
      brand: { maxSize: 2 * 1024 * 1024, maxWidth: 512, maxHeight: 512, quality: 85 },
      product: { maxSize: 5 * 1024 * 1024, maxWidth: 1024, maxHeight: 1024, quality: 80 }
    };

    const currentLimits = limits[type];

    // Check file size
    if (file.size > currentLimits.maxSize) {
      return NextResponse.json(
        { error: `File size too large. Maximum allowed: ${currentLimits.maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const originalSize = buffer.length;

    let processedBuffer: Buffer;
    let width: number;
    let height: number;
    let format: string;

    // Handle SVG files differently
    if (file.type === 'image/svg+xml') {
      // For SVG, just optimize the code
      const svgContent = buffer.toString('utf-8');
      if (!svgContent.includes('<svg')) {
        throw new Error('Invalid SVG file');
      }

      // Simple SVG optimization
      const optimizedSvg = svgContent
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();

      processedBuffer = Buffer.from(optimizedSvg, 'utf-8');
      width = 0; // SVG width is dynamic
      height = 0; // SVG height is dynamic
      format = 'svg';
    } else {
      // Process raster images with Sharp
      const sharpInstance = sharp(buffer);
      const metadata = await sharpInstance.metadata();
      
      // Resize if needed
      let resized = sharpInstance;
      if (metadata.width && metadata.height) {
        if (metadata.width > currentLimits.maxWidth || metadata.height > currentLimits.maxHeight) {
          resized = sharpInstance.resize(currentLimits.maxWidth, currentLimits.maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
          });
        }
      }

      // Compress and convert to WebP
      processedBuffer = await resized
        .webp({ quality: currentLimits.quality })
        .toBuffer();

      const processedMetadata = await sharp(processedBuffer).metadata();
      width = processedMetadata.width || 0;
      height = processedMetadata.height || 0;
      format = 'webp';
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', type);
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const extension = format === 'svg' ? 'svg' : 'webp';
    const filename = `${type}-${timestamp}.${extension}`;
    const filepath = join(uploadsDir, filename);

    // Save the processed image
    await writeFile(filepath, processedBuffer);

    // Return the public URL
    const publicUrl = `/uploads/${type}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      originalSize,
      compressedSize: processedBuffer.length,
      dimensions: {
        width,
        height
      },
      format
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
