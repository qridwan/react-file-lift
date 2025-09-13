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
  // Ensure we have a valid file type, fallback to empty string if undefined
  const fileType = file.type || "";

  // Debug logging
  console.log("createFileWithPreview called with:", {
    fileName: file.name,
    originalType: file.type,
    processedType: fileType,
    fileSize: file.size,
    lastModified: file.lastModified,
  });

  // Create a new File object with the same properties as the original
  const fileWithPreview = new File([file], file.name, {
    type: fileType,
    lastModified: file.lastModified,
  }) as FileWithPreview;

  // Add our custom properties
  fileWithPreview.id = generateFileId();
  fileWithPreview.status = "pending";

  // Create preview URL for images
  if (fileType && fileType.startsWith("image/")) {
    fileWithPreview.preview = URL.createObjectURL(file);
  }

  // Debug the created object
  console.log("Created FileWithPreview:", {
    name: fileWithPreview.name,
    type: fileWithPreview.type,
    size: fileWithPreview.size,
    id: fileWithPreview.id,
    status: fileWithPreview.status,
    hasPreview: !!fileWithPreview.preview,
  });

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
  console.log("isImageFile called with:", file);
  console.log("File properties:", {
    name: file.name,
    type: file.type,
    size: file.size,
    constructor: file.constructor.name,
    isFile: file instanceof File,
    hasType: "type" in file,
    typeValue: file.type,
  });

  const result = !!(file.type && file.type.startsWith("image/"));
  console.log("isImageFile result:", {
    fileName: file.name,
    fileType: file.type,
    isImage: result,
  });
  return result;
}

/**
 * Revokes object URLs to prevent memory leaks
 */
export function revokeObjectURL(file: FileWithPreview): void {
  if (file.preview) {
    URL.revokeObjectURL(file.preview);
  }
}
