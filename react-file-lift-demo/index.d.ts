import * as React from 'react';
import React__default from 'react';
import { FirebaseApp } from 'firebase/app';
import { FirebaseStorage } from 'firebase/storage';

interface FileWithPreview extends File {
    preview?: string;
    id: string;
    progress?: number;
    status: "pending" | "uploading" | "success" | "error" | "compressed";
    error?: string;
    compressedFile?: File;
    uploadedUrl?: string;
}
interface UploadProgress {
    fileId: string;
    progress: number;
    status: FileWithPreview["status"];
    error?: string;
}
interface CompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    initialQuality?: number;
}
interface CloudStorageConfig {
    provider: "aws" | "cloudinary" | "supabase" | "firebase";
    config: AWSConfig | CloudinaryConfig | SupabaseConfig | FirebaseConfig;
}
interface AWSConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
    folder?: string;
}
interface CloudinaryConfig {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    uploadPreset?: string;
    folder?: string;
}
interface SupabaseConfig {
    url: string;
    anonKey: string;
    bucket: string;
    folder?: string;
}
interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    folder?: string;
}
interface FileUploaderProps {
    multiple?: boolean;
    accept?: string;
    maxFiles?: number;
    maxSize?: number;
    className?: string;
    dropzoneClassName?: string;
    previewClassName?: string;
    disabled?: boolean;
    enableCompression?: boolean;
    compressionOptions?: CompressionOptions;
    storageConfig?: CloudStorageConfig;
    onFilesAdded?: (files: FileWithPreview[]) => void;
    onFilesRemoved?: (files: FileWithPreview[]) => void;
    onUploadProgress?: (progress: UploadProgress[]) => void;
    onUploadComplete?: (files: FileWithPreview[]) => void;
    onUploadError?: (error: string, file: FileWithPreview) => void;
    onCompressionComplete?: (originalFile: File, compressedFile: File) => void;
    customUploadHandler?: (file: File) => Promise<string>;
}
interface DropzoneProps {
    children?: React.ReactNode;
    onDrop: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
    activeClassName?: string;
}
interface FilePreviewProps {
    file: FileWithPreview;
    onRemove: (fileId: string) => void;
    onRetry?: (fileId: string) => void;
    className?: string;
    showProgress?: boolean;
}

declare const FileUploader: React__default.FC<FileUploaderProps>;

declare const Dropzone: React__default.FC<DropzoneProps>;

declare const FilePreview: React__default.FC<FilePreviewProps>;

declare class AWSStorage {
    private s3Client;
    private config;
    constructor(config: AWSConfig);
    /**
     * Uploads a file to S3
     */
    uploadFile(file: File, fileName?: string, onProgress?: (progress: number) => void): Promise<string>;
    /**
     * Generates a presigned URL for direct upload
     */
    getPresignedUrl(fileName: string, contentType: string): Promise<string>;
    /**
     * Uploads file with progress tracking using XMLHttpRequest
     */
    private uploadWithProgress;
    /**
     * Generates a unique key for the file
     */
    private generateKey;
    /**
     * Gets the public URL for a file
     */
    private getFileUrl;
}

declare class CloudinaryStorage {
    private config;
    constructor(config: CloudinaryConfig);
    /**
     * Uploads a file to Cloudinary
     */
    uploadFile(file: File, fileName?: string, onProgress?: (progress: number) => void): Promise<string>;
    /**
     * Uploads with progress tracking
     */
    private uploadWithProgress;
    /**
     * Transforms image URL with Cloudinary transformations
     */
    transformImage(url: string, transformations?: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: string;
        format?: string;
    }): string;
    /**
     * Generates a signed upload URL for secure uploads
     */
    getSignedUploadUrl(fileName: string): Promise<string>;
}

declare class SupabaseStorage {
    private supabase;
    private config;
    constructor(config: SupabaseConfig);
    /**
     * Uploads a file to Supabase Storage
     */
    uploadFile(file: File, fileName?: string, onProgress?: (progress: number) => void): Promise<string>;
    /**
     * Uploads file with progress tracking using XMLHttpRequest
     */
    private uploadWithProgress;
    /**
     * Gets the public URL for a file
     */
    getPublicUrl(filePath: string): string;
    /**
     * Creates a signed URL for temporary access
     */
    getSignedUrl(filePath: string, expiresIn?: number): Promise<string>;
    /**
     * Deletes a file from Supabase Storage
     */
    deleteFile(filePath: string): Promise<void>;
    /**
     * Lists files in a folder
     */
    listFiles(folderPath?: string): Promise<any[]>;
    /**
     * Generates a unique file path
     */
    private generateFilePath;
    /**
     * Updates file metadata
     */
    updateFileMetadata(filePath: string, metadata: Record<string, any>): Promise<void>;
}

declare class FirebaseStorageClass {
    private app;
    private storage;
    private config;
    constructor(config: FirebaseConfig);
    /**
     * Uploads a file to Firebase Storage
     */
    uploadFile(file: File, fileName?: string, onProgress?: (progress: number) => void): Promise<string>;
    /**
     * Uploads file with progress tracking
     */
    private uploadWithProgress;
    /**
     * Generates a unique file path
     */
    private generateFilePath;
    /**
     * Gets the download URL for a file
     */
    getDownloadURL(filePath: string): Promise<string>;
    /**
     * Deletes a file from Firebase Storage
     */
    deleteFile(filePath: string): Promise<void>;
    /**
     * Lists files in a folder (requires Cloud Functions)
     */
    listFiles(folderPath?: string): Promise<any[]>;
    /**
     * Updates file metadata
     */
    updateFileMetadata(filePath: string, metadata: Record<string, any>): Promise<void>;
    /**
     * Gets the Firebase app instance
     */
    getApp(): FirebaseApp;
    /**
     * Gets the Firebase Storage instance
     */
    getStorage(): FirebaseStorage;
}

type StorageProvider = AWSStorage | CloudinaryStorage | SupabaseStorage | FirebaseStorageClass;
/**
 * Factory function to create storage provider instances
 */
declare function createStorageProvider(config: CloudStorageConfig): StorageProvider;
/**
 * Generic upload function that works with any storage provider
 */
declare function uploadFile(storageProvider: StorageProvider, file: File, fileName?: string, onProgress?: (progress: number) => void): Promise<string>;

/**
 * Compresses an image file using browser-image-compression
 */
declare function compressImage(file: File, options?: CompressionOptions): Promise<File>;
/**
 * Checks if a file should be compressed based on its type and size
 */
declare function shouldCompressFile(file: File, maxSizeMB?: number): boolean;
/**
 * Gets compression info for a file
 */
declare function getCompressionInfo(originalFile: File, compressedFile: File): {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    savings: number;
};

/**
 * Generates a unique ID for a file
 */
declare function generateFileId(): string;
/**
 * Creates a FileWithPreview object from a File
 */
declare function createFileWithPreview(file: File): FileWithPreview;
/**
 * Validates file against constraints
 */
declare function validateFile(file: File, options?: {
    maxSize?: number;
    accept?: string;
}): {
    valid: boolean;
    error?: string;
};
/**
 * Formats file size in human readable format
 */
declare function formatFileSize(bytes: number): string;
/**
 * Gets file extension from filename
 */
declare function getFileExtension(filename: string): string;
/**
 * Checks if file is an image
 */
declare function isImageFile(file: File): boolean;
/**
 * Revokes object URLs to prevent memory leaks
 */
declare function revokeObjectURL(file: FileWithPreview): void;

export { AWSStorage, CloudinaryStorage, Dropzone, FilePreview, FileUploader, FirebaseStorageClass, SupabaseStorage, compressImage, createFileWithPreview, createStorageProvider, formatFileSize, generateFileId, getCompressionInfo, getFileExtension, isImageFile, revokeObjectURL, shouldCompressFile, uploadFile, validateFile };
export type { AWSConfig, CloudStorageConfig, CloudinaryConfig, CompressionOptions, DropzoneProps, FilePreviewProps, FileUploaderProps, FileWithPreview, FirebaseConfig, SupabaseConfig, UploadProgress };
