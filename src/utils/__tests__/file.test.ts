import {
  generateFileId,
  validateFile,
  formatFileSize,
  getFileExtension,
  isImageFile,
} from "../file";

describe("file utilities", () => {
  describe("generateFileId", () => {
    it("should generate unique IDs", () => {
      const id1 = generateFileId();
      const id2 = generateFileId();

      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe("string");
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe("validateFile", () => {
    const createMockFile = (name: string, size: number, type: string) =>
      new File([], name, { type }) as File & { size: number };

    it("should validate file size", () => {
      const file = createMockFile("test.jpg", 2 * 1024 * 1024, "image/jpeg"); // 2MB
      file.size = 2 * 1024 * 1024;

      const result = validateFile(file, { maxSize: 1024 * 1024 }); // 1MB limit

      expect(result.valid).toBe(false);
      expect(result.error).toContain("exceeds");
    });

    it("should validate file type by MIME type", () => {
      const file = createMockFile("test.txt", 1024, "text/plain");

      const result = validateFile(file, { accept: "image/*" });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("not accepted");
    });

    it("should validate file type by extension", () => {
      const file = createMockFile("test.txt", 1024, "text/plain");

      const result = validateFile(file, { accept: ".jpg,.png" });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("not accepted");
    });

    it("should pass validation for valid files", () => {
      const file = createMockFile("test.jpg", 1024, "image/jpeg");
      file.size = 1024;

      const result = validateFile(file, {
        maxSize: 2048,
        accept: "image/*",
      });

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe("formatFileSize", () => {
    it("should format bytes correctly", () => {
      expect(formatFileSize(0)).toBe("0 Bytes");
      expect(formatFileSize(1024)).toBe("1 KB");
      expect(formatFileSize(1024 * 1024)).toBe("1 MB");
      expect(formatFileSize(1024 * 1024 * 1024)).toBe("1 GB");
      expect(formatFileSize(1536)).toBe("1.5 KB");
    });
  });

  describe("getFileExtension", () => {
    it("should extract file extensions correctly", () => {
      expect(getFileExtension("test.jpg")).toBe("jpg");
      expect(getFileExtension("document.pdf")).toBe("pdf");
      expect(getFileExtension("archive.tar.gz")).toBe("gz");
      expect(getFileExtension("noextension")).toBe("");
    });
  });

  describe("isImageFile", () => {
    it("should identify image files correctly", () => {
      const imageFile = new File([], "test.jpg", { type: "image/jpeg" });
      const textFile = new File([], "test.txt", { type: "text/plain" });

      expect(isImageFile(imageFile)).toBe(true);
      expect(isImageFile(textFile)).toBe(false);
    });
  });
});
