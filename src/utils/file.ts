import { FileWithPreview } from "../types";

/**
 * Generates a unique ID for a file
 */
export function generateFileId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Creates a FileWithPreview object from a File
 */
export function createFileWithPreview(file: File): FileWithPreview {
  const fileWithPreview: FileWithPreview = {
    ...file,
    id: generateFileId(),
    status: "pending",
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    webkitRelativePath: file.webkitRelativePath,
    stream: file.stream.bind(file),
    text: file.text.bind(file),
    arrayBuffer: file.arrayBuffer.bind(file),
    slice: file.slice.bind(file),
  };

  // Create preview URL for images
  if (file.type.startsWith("image/")) {
    fileWithPreview.preview = URL.createObjectURL(file);
  }

  return fileWithPreview;
}

/**
 * Validates file against constraints
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number;
    accept?: string;
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize, accept } = options;

  // Check file size
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check file type
  if (accept) {
    const acceptedTypes = accept.split(",").map((type) => type.trim());
    const isValidType = acceptedTypes.some((acceptedType) => {
      if (acceptedType.startsWith(".")) {
        // File extension
        return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
      } else {
        // MIME type
        return file.type.match(new RegExp(acceptedType.replace("*", ".*")));
      }
    });

    if (!isValidType) {
      return {
        valid: false,
        error: `File type not accepted. Accepted types: ${accept}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Formats file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * Checks if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Revokes object URLs to prevent memory leaks
 */
export function revokeObjectURL(file: FileWithPreview): void {
  if (file.preview) {
    URL.revokeObjectURL(file.preview);
  }
}
