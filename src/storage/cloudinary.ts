/* eslint-disable no-unused-vars */
import { CloudinaryConfig } from "../types";

export class CloudinaryStorage {
  private config: CloudinaryConfig;

  constructor(config: CloudinaryConfig) {
    this.config = config;
  }

  /**
   * Uploads a file to Cloudinary
   */
  async uploadFile(
    file: File,
    fileName?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // Validate file parameter
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file parameter - must be a File object");
    }

    console.log("Cloudinary uploadFile called with:", {
      file: file,
      fileName: fileName,
      fileType: typeof file,
      fileConstructor: file.constructor.name,
      fileSize: file.size,
      file_Name: file.name,
    });

    // Validate required configuration
    if (!this.config.cloudName || this.config.cloudName.trim() === "") {
      throw new Error("Cloudinary cloud name is required and cannot be empty");
    }

    if (!this.config.uploadPreset && !this.config.apiKey) {
      throw new Error("Cloudinary upload preset or API key is required");
    }

    // Additional validation for cloud name format
    if (!/^[a-zA-Z0-9_-]+$/.test(this.config.cloudName)) {
      throw new Error("Cloudinary cloud name contains invalid characters");
    }

    const formData = new FormData();

    formData.append("file", file);

    const uploadPreset = String(this.config.uploadPreset || "unsigned_preset");
    console.log(
      "Cloudinary upload preset:",
      uploadPreset,
      "type:",
      typeof uploadPreset
    );
    formData.append("upload_preset", uploadPreset);

    if (this.config.folder) {
      const folder = String(this.config.folder);
      console.log("Cloudinary folder:", folder, "type:", typeof folder);
      formData.append("folder", folder);
    }

    if (fileName) {
      // Remove file extension and any special characters for public_id
      const publicId = String(fileName)
        .split(".")[0]
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      console.log(
        "Setting Cloudinary public_id:",
        publicId,
        "type:",
        typeof publicId
      );
      formData.append("public_id", publicId);
    }

    console.log(
      "Cloudinary upload URL:",
      `https://api.cloudinary.com/v1_1/${this.config.cloudName}/upload`
    );
    console.log("Cloudinary cloud name:", this.config.cloudName);

    try {
      const response = await this.uploadWithProgress(formData, onProgress);

      if (!response || !response.secure_url) {
        throw new Error("Invalid response from Cloudinary");
      }

      return response.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to upload to Cloudinary: ${errorMessage}`);
    }
  }

  /**
   * Uploads with progress tracking
   */
  private async uploadWithProgress(
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/upload`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener("load", () => {
        console.log("Cloudinary upload response status:", xhr.status);
        console.log("Cloudinary upload response text:", xhr.responseText);

        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            console.log("Cloudinary upload response parsed:", response);

            // Check for Cloudinary error in response
            if (response.error) {
              const errorMsg = response.error.message || response.error;
              console.error("Cloudinary API error:", errorMsg);
              reject(new Error(`Cloudinary error: ${errorMsg}`));
              return;
            }

            if (!response.secure_url) {
              console.error("No secure_url in Cloudinary response:", response);
              reject(new Error("No secure_url in Cloudinary response"));
              return;
            }

            resolve(response);
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            console.error("Failed to parse Cloudinary response:", errorMessage);
            reject(new Error(`Failed to parse response: ${errorMessage}`));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            console.error("Cloudinary upload failed:", errorResponse);
            reject(
              new Error(
                `Upload failed: ${
                  errorResponse.error?.message || `Status ${xhr.status}`
                }`
              )
            );
          } catch {
            console.error("Cloudinary upload failed with status:", xhr.status);
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("POST", uploadUrl);
      xhr.send(formData);
    });
  }

  /**
   * Transforms image URL with Cloudinary transformations
   */
  transformImage(
    url: string,
    transformations: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {}
  ): string {
    if (!url.includes("cloudinary.com")) {
      return url;
    }

    const transformationString = Object.entries(transformations)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => {
        // Map common transformation keys
        const keyMap: { [key: string]: string } = {
          width: "w",
          height: "h",
          crop: "c",
          quality: "q",
          format: "f",
        };
        return `${keyMap[key] || key}_${value}`;
      })
      .join(",");

    if (!transformationString) {
      return url;
    }

    // Insert transformation into Cloudinary URL
    return url.replace("/upload/", `/upload/${transformationString}/`);
  }

  /**
   * Generates a signed upload URL for secure uploads
   */
  async getSignedUploadUrl(fileName: string): Promise<string> {
    if (!this.config.apiSecret) {
      throw new Error("API secret required for signed uploads");
    }

    // This would typically be done on your backend for security
    // Included here for completeness, but consider moving to server-side
    const timestamp = Math.round(Date.now() / 1000);
    const params = {
      timestamp,
      folder: this.config.folder || "",
      public_id: fileName.split(".")[0],
    };

    // Note: In production, generate signature on your backend
    // This is just for demonstration purposes
    return `https://api.cloudinary.com/v1_1/${this.config.cloudName}/upload`;
  }

  /**
   * Deletes a file from Cloudinary
   * Note: This requires server-side implementation for security
   */
  async deleteFile(publicId: string): Promise<void> {
    // Cloudinary requires server-side deletion for security
    // Client-side deletion is not supported due to signature requirements

    console.warn(
      `Cloudinary file deletion not supported from client-side. ` +
        `File with public_id "${publicId}" will remain in Cloudinary storage. ` +
        `Please implement a backend endpoint for proper file deletion.`
    );

    // For now, we'll just log the warning and continue
    // The file will be removed from the UI but not from Cloudinary
    console.log(
      "File removed from UI but not from Cloudinary storage:",
      publicId
    );

    // Don't attempt actual deletion since it will fail with signature error
    // This prevents the error from being thrown and breaking the UI
  }

  /**
   * Extracts public ID from Cloudinary URL
   */
  extractPublicId(url: string): string | null {
    if (!url.includes("cloudinary.com")) {
      return null;
    }

    // Extract public ID from URL pattern: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
    const match = url.match(
      /\/upload\/(?:v\d+\/)?(?:.*\/)?([^/]+)(?:\.[^.]+)?$/
    );
    return match ? match[1] : null;
  }
}
