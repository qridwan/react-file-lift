// Main components
export { FileUploader } from "./components/FileUploader";
export { Dropzone } from "./components/Dropzone";
export { FilePreview } from "./components/FilePreview";

// Types
export type {
  FileWithPreview,
  UploadProgress,
  CompressionOptions,
  CloudStorageConfig,
  AWSConfig,
  CloudinaryConfig,
  SupabaseConfig,
  FirebaseConfig,
  FileUploaderProps,
  DropzoneProps,
  FilePreviewProps,
} from "./types";

// Storage providers
export {
  AWSStorage,
  CloudinaryStorage,
  SupabaseStorage,
  FirebaseStorageClass,
  createStorageProvider,
  uploadFile,
} from "./storage";

// Utilities
export {
  compressImage,
  shouldCompressFile,
  getCompressionInfo,
} from "./utils/compression";

export {
  generateFileId,
  createFileWithPreview,
  validateFile,
  formatFileSize,
  getFileExtension,
  isImageFile,
  revokeObjectURL,
} from "./utils/file";

// Styles
import "./styles/index.css";
