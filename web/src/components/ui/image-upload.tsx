'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Image as ImageIcon, FileImage, CheckCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  selectedImage?: File | null;
  type?: 'brand' | 'product';
  className?: string;
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  selectedImage,
  type = 'product',
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const limits = {
    brand: { maxSize: 2 * 1024 * 1024, maxWidth: 512, maxHeight: 512 }, // 2MB, 512x512
    product: { maxSize: 5 * 1024 * 1024, maxWidth: 1024, maxHeight: 1024 } // 5MB, 1024x1024
  };

  const currentLimits = limits[type];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, SVG, and WebP images are allowed.');
      }

      // Validate file size
      if (file.size > currentLimits.maxSize) {
        throw new Error(`File size too large. Maximum allowed: ${formatFileSize(currentLimits.maxSize)}`);
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Call the callback with the file
      onImageSelect(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setError(null);
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Image Upload</Label>
      
      <div className="space-y-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {!selectedImage ? (
          <Card 
            className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer"
            onClick={handleClick}
          >
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-2">Click to upload image</p>
              <p className="text-xs text-muted-foreground text-center">
                Supports: JPEG, PNG, SVG, WebP<br />
                Max size: {formatFileSize(currentLimits.maxSize)}<br />
                Max dimensions: {currentLimits.maxWidth}x{currentLimits.maxHeight}px
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="relative">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {preview && (
                  <div className="flex-shrink-0">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileImage className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium truncate">
                      {selectedImage.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(selectedImage.size)})
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Ready for upload and processing
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isUploading && (
        <Alert>
          <ImageIcon className="h-4 w-4" />
          <AlertDescription>
            Processing image... This may take a moment.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}