/* eslint-disable no-unused-vars */
import { AWSConfig } from "../types";

// Dynamic imports for peer dependencies
let S3Client: any;
let PutObjectCommand: any;
let getSignedUrl: any;

// Lazy load AWS SDK
async function loadAWSSDK() {
  if (!S3Client) {
    try {
      const s3Module = await import("@aws-sdk/client-s3");
      const presignerModule = await import("@aws-sdk/s3-request-presigner");

      S3Client = s3Module.S3Client;
      PutObjectCommand = s3Module.PutObjectCommand;
      getSignedUrl = presignerModule.getSignedUrl;
    } catch (error) {
      throw new Error(
        "AWS SDK not found. Please install @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner"
      );
    }
  }
}

export class AWSStorage {
  private s3Client: any;
  private config: AWSConfig;
  private sdkLoaded: boolean = false;

  constructor(config: AWSConfig) {
    this.config = config;
    // S3Client will be initialized lazily when first used
  }

  private async ensureSDKLoaded() {
    if (!this.sdkLoaded) {
      await loadAWSSDK();
      this.s3Client = new S3Client({
        region: this.config.region,
        credentials: {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey,
        },
      });
      this.sdkLoaded = true;
    }
  }

  /**
   * Uploads a file to S3
   */
  async uploadFile(
    file: File,
    fileName?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    await this.ensureSDKLoaded();

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
    await this.ensureSDKLoaded();

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
