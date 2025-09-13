/* eslint-disable no-unused-vars */
import { SupabaseConfig } from "../types";

// Dynamic imports for peer dependencies
let createClient: any;
let SupabaseClient: any;

// Lazy load Supabase SDK
async function loadSupabaseSDK() {
  if (!createClient) {
    try {
      const supabaseModule = await import("@supabase/supabase-js");
      createClient = supabaseModule.createClient;
      SupabaseClient = supabaseModule.SupabaseClient;
    } catch (error) {
      throw new Error(
        "Supabase SDK not found. Please install @supabase/supabase-js: npm install @supabase/supabase-js"
      );
    }
  }
}

export class SupabaseStorage {
  private supabase: any;
  private config: SupabaseConfig;
  private sdkLoaded: boolean = false;

  constructor(config: SupabaseConfig) {
    this.config = config;
    // Supabase client will be initialized lazily when first used
  }

  private async ensureSDKLoaded() {
    if (!this.sdkLoaded) {
      await loadSupabaseSDK();
      this.supabase = createClient(this.config.url, this.config.anonKey);
      this.sdkLoaded = true;
    }
  }

  /**
   * Uploads a file to Supabase Storage
   */
  async uploadFile(
    file: File,
    fileName?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    await this.ensureSDKLoaded();

    const filePath = this.generateFilePath(fileName || file.name);

    try {
      // For progress tracking, we'll use a custom implementation
      if (onProgress) {
        return await this.uploadWithProgress(file, filePath, onProgress);
      }

      const { data, error } = await this.supabase.storage
        .from(this.config.bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      return this.getPublicUrl(data.path);
    } catch (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Failed to upload to Supabase: ${error}`);
    }
  }

  /**
   * Uploads file with progress tracking using XMLHttpRequest
   */
  private async uploadWithProgress(
    file: File,
    filePath: string,
    onProgress: (progress: number) => void
  ): Promise<string> {
    // Get signed URL for upload
    const { data: signedUrlData, error: signedUrlError } =
      await this.supabase.storage
        .from(this.config.bucket)
        .createSignedUploadUrl(filePath);

    if (signedUrlError) {
      throw signedUrlError;
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          resolve(this.getPublicUrl(filePath));
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("PUT", signedUrlData.signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  }

  /**
   * Gets the public URL for a file
   */
  getPublicUrl(filePath: string): string {
    const { data } = this.supabase.storage
      .from(this.config.bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Creates a signed URL for temporary access
   */
  async getSignedUrl(
    filePath: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.config.bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw error;
    }

    return data.signedUrl;
  }

  /**
   * Lists files in a folder
   */
  async listFiles(folderPath?: string): Promise<any[]> {
    const { data, error } = await this.supabase.storage
      .from(this.config.bucket)
      .list(folderPath);

    if (error) {
      throw error;
    }

    return data || [];
  }

  /**
   * Generates a unique file path
   */
  private generateFilePath(fileName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const folder = this.config.folder ? `${this.config.folder}/` : "";

    return `${folder}${timestamp}-${randomString}-${fileName}`;
  }

  /**
   * Updates file metadata
   */
  async updateFileMetadata(
    filePath: string,
    metadata: Record<string, any>
  ): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.config.bucket)
      .update(filePath, new Blob([]), {
        cacheControl: "3600",
        ...metadata,
      });

    if (error) {
      throw error;
    }
  }

  /**
   * Deletes a file from Supabase Storage
   */
  async deleteFile(filePath: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.config.bucket)
      .remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error(`Failed to delete file from Supabase: ${error.message}`);
    }

    console.log("File deleted successfully from Supabase:", filePath);
  }

  /**
   * Extracts file path from Supabase URL
   */
  extractFilePath(url: string): string | null {
    if (!url.includes("supabase.co") && !url.includes("supabase")) {
      return null;
    }

    // Extract file path from URL pattern: https://project.supabase.co/storage/v1/object/public/bucket/path
    const match = url.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  }
}
