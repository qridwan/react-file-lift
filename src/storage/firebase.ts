import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getStorage,
  FirebaseStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTaskSnapshot,
} from "firebase/storage";
import { FirebaseConfig } from "../types";

export class FirebaseStorageClass {
  private app: FirebaseApp;
  private storage: FirebaseStorage;
  private config: FirebaseConfig;

  constructor(config: FirebaseConfig) {
    this.config = config;

    // Initialize Firebase app
    this.app = initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    });

    // Initialize Firebase Storage
    this.storage = getStorage(this.app);
  }

  /**
   * Uploads a file to Firebase Storage
   */
  async uploadFile(
    file: File,
    fileName?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
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
        (snapshot: UploadTaskSnapshot) => {
          // Progress tracking
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
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
    const fileRef = ref(this.storage, filePath);
    return await getDownloadURL(fileRef);
  }

  /**
   * Deletes a file from Firebase Storage
   */
  async deleteFile(filePath: string): Promise<void> {
    const fileRef = ref(this.storage, filePath);
    // Note: Firebase v9+ doesn't have a direct delete method in the client SDK
    // This would typically be done through Cloud Functions or Admin SDK
    throw new Error(
      "File deletion not supported in client SDK. Use Cloud Functions or Admin SDK."
    );
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
  getApp(): FirebaseApp {
    return this.app;
  }

  /**
   * Gets the Firebase Storage instance
   */
  getStorage(): FirebaseStorage {
    return this.storage;
  }
}
