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

export { AWSStorage } from "./aws";
export { CloudinaryStorage } from "./cloudinary";
export { SupabaseStorage } from "./supabase";
export { FirebaseStorageClass } from "./firebase";
