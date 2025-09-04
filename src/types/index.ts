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

  // Compression
  enableCompression?: boolean;
  compressionOptions?: CompressionOptions;

  // Cloud storage
  storageConfig?: CloudStorageConfig;

  // Callbacks
  onFilesAdded?: (files: FileWithPreview[]) => void;
  onFilesRemoved?: (files: FileWithPreview[]) => void;
  onUploadProgress?: (progress: UploadProgress[]) => void;
  onUploadComplete?: (files: FileWithPreview[]) => void;
  onUploadError?: (error: string, file: FileWithPreview) => void;
  onCompressionComplete?: (originalFile: File, compressedFile: File) => void;

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
  file: FileWithPreview;
  onRemove: (fileId: string) => void;
  onRetry?: (fileId: string) => void;
  className?: string;
  showProgress?: boolean;
}
