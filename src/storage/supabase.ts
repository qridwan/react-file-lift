import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseConfig } from "../types";

export class SupabaseStorage {
  private supabase: SupabaseClient;
  private config: SupabaseConfig;

  constructor(config: SupabaseConfig) {
    this.config = config;
    this.supabase = createClient(config.url, config.anonKey);
  }

  /**
   * Uploads a file to Supabase Storage
   */
  async uploadFile(
    file: File,
    fileName?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
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
   * Deletes a file from Supabase Storage
   */
  async deleteFile(filePath: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.config.bucket)
      .remove([filePath]);

    if (error) {
      throw error;
    }
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
}
