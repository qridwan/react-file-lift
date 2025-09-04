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
    // Validate required configuration
    if (!this.config.cloudName) {
      throw new Error("Cloudinary cloud name is required");
    }

    if (!this.config.uploadPreset && !this.config.apiKey) {
      throw new Error("Cloudinary upload preset or API key is required");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("lear", this.config.uploadPreset || "unsigned_preset");

    if (this.config.folder) {
      formData.append("folder", this.config.folder);
    }

    if (fileName) {
      // Remove file extension and any special characters for public_id
      const publicId = fileName.split(".")[0].replace(/[^a-zA-Z0-9_-]/g, "_");
      formData.append("public_id", publicId);
    }

    try {
      const response = await this.uploadWithProgress(formData, onProgress);

      if (!response || !response.secure_url) {
        throw new Error("Invalid response from Cloudinary");
      }

      return response.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error(`Failed to upload to Cloudinary: ${error}`);
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
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);

            // Check for Cloudinary error in response
            if (response.error) {
              reject(
                new Error(
                  `Cloudinary error: ${
                    response.error.message || response.error
                  }`
                )
              );
              return;
            }

            resolve(response);
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error}`));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(
              new Error(
                `Upload failed: ${
                  errorResponse.error?.message || `Status ${xhr.status}`
                }`
              )
            );
          } catch {
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
}
