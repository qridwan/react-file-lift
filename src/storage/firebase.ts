/* eslint-disable no-unused-vars */
import { FirebaseConfig } from "../types";

// Dynamic imports for peer dependencies
let initializeApp: any;
let getStorage: any;
let ref: any;
let uploadBytesResumable: any;
let getDownloadURL: any;
let UploadTaskSnapshot: any;
let FirebaseApp: any;
let FirebaseStorage: any;

// Lazy load Firebase SDK
async function loadFirebaseSDK() {
  if (!initializeApp) {
    try {
      const appModule = await import("firebase/app");
      const storageModule = await import("firebase/storage");

      initializeApp = appModule.initializeApp;
      // @ts-ignore - Firebase types not available at build time (peer dependency)
      FirebaseApp = appModule.FirebaseApp;
      getStorage = storageModule.getStorage;

      // @ts-ignore - Firebase types not available at build time (peer dependency)
      FirebaseStorage = storageModule.FirebaseStorage;
      ref = storageModule.ref;
      uploadBytesResumable = storageModule.uploadBytesResumable;
      getDownloadURL = storageModule.getDownloadURL;
      // @ts-ignore - Firebase types not available at build time (peer dependency)
      UploadTaskSnapshot = storageModule.UploadTaskSnapshot;
    } catch (error) {
      throw new Error(
        "Firebase SDK not found. Please install firebase: npm install firebase"
      );
    }
  }
}

export class FirebaseStorageClass {
  private app: any;
  private storage: any;
  private config: FirebaseConfig;
  private sdkLoaded: boolean = false;

  constructor(config: FirebaseConfig) {
    this.config = config;
    // Firebase app and storage will be initialized lazily when first used
  }

  private async ensureSDKLoaded() {
    if (!this.sdkLoaded) {
      await loadFirebaseSDK();

      // Initialize Firebase app
      this.app = initializeApp({
        apiKey: this.config.apiKey,
        authDomain: this.config.authDomain,
        projectId: this.config.projectId,
        storageBucket: this.config.storageBucket,
        messagingSenderId: this.config.messagingSenderId,
        appId: this.config.appId,
      });

      // Initialize Firebase Storage
      this.storage = getStorage(this.app);
      this.sdkLoaded = true;
    }
  }

  /**
   * Uploads a file to Firebase Storage
   */
  async uploadFile(
    file: File,
    fileName?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    await this.ensureSDKLoaded();

    const filePath = this.generateFilePath(fileName || file.name);
    const storageRef = ref(this.storage, filePath);

    try {
      if (onProgress) {
        return await this.uploadWithProgress(file, storageRef, onProgress);
      }

      // Simple upload without progress tracking
      const snapshot = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Firebase Storage upload error:", error);
      throw new Error(`Failed to upload to Firebase Storage: ${error}`);
    }
  }

  /**
   * Uploads file with progress tracking
   */
  private async uploadWithProgress(
    file: File,
    storageRef: any,
    onProgress: (progress: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot: any) => {
          // Progress tracking
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error: any) => {
          // Handle unsuccessful uploads
          console.error("Firebase upload error:", error);
          reject(error);
        },
        async () => {
          // Handle successful uploads
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
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
   * Gets the download URL for a file
   */
  async getDownloadURL(filePath: string): Promise<string> {
    await this.ensureSDKLoaded();

    const fileRef = ref(this.storage, filePath);
    return await getDownloadURL(fileRef);
  }

  /**
   * Lists files in a folder (requires Cloud Functions)
   */
  async listFiles(folderPath?: string): Promise<any[]> {
    // Note: Firebase v9+ doesn't have a direct list method in the client SDK
    // This would typically be done through Cloud Functions
    throw new Error(
      "File listing not supported in client SDK. Use Cloud Functions or Admin SDK."
    );
  }

  /**
   * Updates file metadata
   */
  async updateFileMetadata(
    filePath: string,
    metadata: Record<string, any>
  ): Promise<void> {
    // Note: Firebase v9+ doesn't have a direct metadata update method in the client SDK
    // This would typically be done through Cloud Functions or Admin SDK
    throw new Error(
      "Metadata update not supported in client SDK. Use Cloud Functions or Admin SDK."
    );
  }

  /**
   * Gets the Firebase app instance
   */
  async getApp(): Promise<any> {
    await this.ensureSDKLoaded();
    return this.app;
  }

  /**
   * Gets the Firebase Storage instance
   */
  async getStorage(): Promise<any> {
    await this.ensureSDKLoaded();
    return this.storage;
  }

  /**
   * Deletes a file from Firebase Storage
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      const storage = await this.getStorage();
      const { deleteObject, ref } = await import("firebase/storage");

      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);

      console.log("File deleted successfully from Firebase:", filePath);
    } catch (error) {
      console.error("Firebase delete error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to delete file from Firebase: ${errorMessage}`);
    }
  }

  /**
   * Extracts file path from Firebase URL
   */
  extractFilePath(url: string): string | null {
    if (!url.includes("firebase") && !url.includes("googleapis.com")) {
      return null;
    }

    // Extract file path from URL pattern: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Ffile?alt=media
    const match = url.match(/\/o\/(.+?)(?:\?|$)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
}
