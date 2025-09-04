import imageCompression from 'browser-image-compression';
import { CompressionOptions } from '../types';

/**
 * Compresses an image file using browser-image-compression
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxSizeMB = 1,
    maxWidthOrHeight = 1920,
    useWebWorker = true,
    initialQuality = 0.8,
  } = options;

  // Only compress image files
  if (!file.type.startsWith('image/')) {
    return file;
  }

  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker,
      initialQuality,
    });

    return compressedFile;
  } catch (error) {
    console.error('Compression failed:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Checks if a file should be compressed based on its type and size
 */
export function shouldCompressFile(file: File, maxSizeMB: number = 1): boolean {
  const isImage = file.type.startsWith('image/');
  const isLargeFile = file.size > maxSizeMB * 1024 * 1024;
  
  return isImage && isLargeFile;
}

/**
 * Gets compression info for a file
 */
export function getCompressionInfo(originalFile: File, compressedFile: File) {
  const originalSizeMB = originalFile.size / (1024 * 1024);
  const compressedSizeMB = compressedFile.size / (1024 * 1024);
  const compressionRatio = ((originalFile.size - compressedFile.size) / originalFile.size) * 100;

  return {
    originalSize: originalSizeMB,
    compressedSize: compressedSizeMB,
    compressionRatio,
    savings: originalSizeMB - compressedSizeMB,
  };
}
