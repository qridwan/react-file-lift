import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWSConfig } from "../types";

export class AWSStorage {
  private s3Client: S3Client;
  private config: AWSConfig;

  constructor(config: AWSConfig) {
    this.config = config;
    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  /**
   * Uploads a file to S3
   */
  async uploadFile(
    file: File,
    fileName?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const key = this.generateKey(fileName || file.name);

    try {
      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: file,
        ContentType: file.type,
      });

      // For progress tracking, we'll use a custom implementation
      if (onProgress) {
        await this.uploadWithProgress(file, key, onProgress);
      } else {
        await this.s3Client.send(command);
      }

      return this.getFileUrl(key);
    } catch (error) {
      console.error("AWS S3 upload error:", error);
      throw new Error(`Failed to upload to S3: ${error}`);
    }
  }

  /**
   * Generates a presigned URL for direct upload
   */
  async getPresignedUrl(
    fileName: string,
    contentType: string
  ): Promise<string> {
    const key = this.generateKey(fileName);

    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  /**
   * Uploads file with progress tracking using XMLHttpRequest
   */
  private async uploadWithProgress(
    file: File,
    key: string,
    onProgress: (progress: number) => void
  ): Promise<void> {
    const presignedUrl = await this.getPresignedUrl(file.name, file.type);

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
          resolve();
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  }

  /**
   * Generates a unique key for the file
   */
  private generateKey(fileName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const folder = this.config.folder ? `${this.config.folder}/` : "";

    return `${folder}${timestamp}-${randomString}-${fileName}`;
  }

  /**
   * Gets the public URL for a file
   */
  private getFileUrl(key: string): string {
    return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`;
  }
}
