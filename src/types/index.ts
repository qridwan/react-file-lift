// React import for React.ReactNode type
import * as React from "react";

export interface FileWithPreview extends File {
  preview?: string;
  id: string;
  progress?: number;
  status: "pending" | "uploading" | "success" | "error" | "compressed";
  error?: string;
  compressedFile?: File;
  uploadedUrl?: string;
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: FileWithPreview["status"];
  error?: string;
}

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  initialQuality?: number;
}

export interface CloudStorageConfig {
  provider: "aws" | "cloudinary" | "supabase" | "firebase";
  config: AWSConfig | CloudinaryConfig | SupabaseConfig | FirebaseConfig;
}

export interface AWSConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  folder?: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset?: string;
  folder?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  bucket: string;
  folder?: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  folder?: string;
}

export interface FileUploaderProps {
  // Core functionality
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes

  // UI customization
  className?: string;
  dropzoneClassName?: string;
  previewClassName?: string;
  disabled?: boolean;

  // Upload behavior
  autoUpload?: boolean; // Whether to auto-upload files when added (default: true)
  showUploadButton?: boolean; // Whether to show upload button (default: false when autoUpload is true)

  // Compression
  enableCompression?: boolean;
  compressionOptions?: CompressionOptions;

  // Cloud storage
  storageConfig?: CloudStorageConfig;

  // Callbacks
  onFilesAdded?: (files: FileWithPreview[]) => void;
  onFilesRemoved?: (files: FileWithPreview[]) => void;
  onRemove?: (fileId: string) => void; // Individual file removal callback
  onUploadProgress?: (progress: UploadProgress[]) => void;
  onUploadComplete?: (files: FileWithPreview[]) => void;
  onUploadError?: (error: string, file: FileWithPreview) => void;
  onCompressionComplete?: (originalFile: File, compressedFile: File) => void;
  onDeleteError?: (file: FileWithPreview, error: Error) => void;

  // Custom upload handler
  customUploadHandler?: (file: File) => Promise<string>;
}

export interface DropzoneProps {
  children?: React.ReactNode;
  onDrop: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  activeClassName?: string;
}

export interface FilePreviewProps {
  /** The file object to display */
  file: FileWithPreview;
  /** Callback function called when the file is removed */
  onRemove: (fileId: string) => void;
  /** Optional callback function called when retry is requested */
  onRetry?: (fileId: string) => void;
  /** Optional callback function called when upload is requested for pending files */
  onUpload?: (fileId: string) => void;
  /** Additional CSS class name for the component */
  className?: string;
  /** Whether to show the progress bar during upload */
  showProgress?: boolean;
  /** Whether to show upload button for pending files */
  showUploadButton?: boolean;
  /** Optional callback for when the preview image loads */
  onImageLoad?: (file: FileWithPreview) => void;
  /** Optional callback for when the preview image fails to load */
  onImageError?: (file: FileWithPreview, error: Error) => void;
  /** Optional storage provider for cloud file deletion */
  storageProvider?: any; // Using any to avoid circular dependency
  /** Optional callback for when cloud file deletion fails */
  onDeleteError?: (file: FileWithPreview, error: Error) => void;
}
