/* eslint-disable no-unused-vars */
import {
  AWSConfig,
  CloudinaryConfig,
  CloudStorageConfig,
  FirebaseConfig,
  SupabaseConfig,
} from "../types";
import { AWSStorage } from "./aws";
import { CloudinaryStorage } from "./cloudinary";
import { SupabaseStorage } from "./supabase";
import { FirebaseStorageClass } from "./firebase";

export type StorageProvider =
  | AWSStorage
  | CloudinaryStorage
  | SupabaseStorage
  | FirebaseStorageClass;

/**
 * Factory function to create storage provider instances
 */
export function createStorageProvider(
  config: CloudStorageConfig
): StorageProvider {
  switch (config.provider) {
    case "aws":
      return new AWSStorage(config.config as AWSConfig);
    case "cloudinary":
      return new CloudinaryStorage(config.config as CloudinaryConfig);
    case "supabase":
      return new SupabaseStorage(config.config as SupabaseConfig);
    case "firebase":
      return new FirebaseStorageClass(config.config as FirebaseConfig);
    default:
      throw new Error(`Unsupported storage provider: ${config.provider}`);
  }
}

/**
 * Generic upload function that works with any storage provider
 */
export async function uploadFile(
  storageProvider: StorageProvider,
  file: File,
  fileName?: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return await storageProvider.uploadFile(file, fileName, onProgress);
}

/**
 * Generic delete function that works with any storage provider
 */
export async function deleteFile(
  storageProvider: StorageProvider,
  fileUrl: string
): Promise<void> {
  // Extract the appropriate identifier based on storage provider type
  if ("extractPublicId" in storageProvider) {
    // Cloudinary
    const publicId = (storageProvider as any).extractPublicId(fileUrl);
    if (publicId) {
      await (storageProvider as any).deleteFile(publicId);
    } else {
      throw new Error("Invalid Cloudinary URL");
    }
  } else if ("extractKey" in storageProvider) {
    // AWS S3
    const key = (storageProvider as any).extractKey(fileUrl);
    if (key) {
      await (storageProvider as any).deleteFile(key);
    } else {
      throw new Error("Invalid S3 URL");
    }
  } else if ("extractFilePath" in storageProvider) {
    // Supabase or Firebase
    const filePath = (storageProvider as any).extractFilePath(fileUrl);
    if (filePath) {
      await (storageProvider as any).deleteFile(filePath);
    } else {
      throw new Error("Invalid storage URL");
    }
  } else {
    throw new Error("Unsupported storage provider for deletion");
  }
}

export { AWSStorage } from "./aws";
export { CloudinaryStorage } from "./cloudinary";
export { SupabaseStorage } from "./supabase";
export { FirebaseStorageClass } from "./firebase";
