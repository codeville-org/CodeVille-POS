import { createId } from "@paralleldrive/cuid2";
import { app } from "electron";
import fs from "fs/promises";
import path from "path";

export class ImageManager {
  private imagesDir: string;

  constructor() {
    this.imagesDir = this.getImagesDirectory();
  }

  private getImagesDirectory(): string {
    let baseDir: string;

    if (app.isPackaged) {
      // Production: Use app data directory
      baseDir = app.getPath("userData");
    } else {
      // Development: Use current directory
      baseDir = process.cwd();
    }

    return path.join(baseDir, "images", "products");
  }

  async initialize(): Promise<void> {
    try {
      // Ensure the images directory exists
      await fs.mkdir(this.imagesDir, { recursive: true });
      console.log(`Images directory initialized at: ${this.imagesDir}`);
    } catch (error) {
      console.error("Failed to initialize images directory:", error);
      throw error;
    }
  }

  /**
   * Save image from file path
   */
  async saveImageFromPath(sourceImagePath: string): Promise<string> {
    try {
      const imageBuffer = await fs.readFile(sourceImagePath);
      return await this.saveImageFromBuffer(imageBuffer, sourceImagePath);
    } catch (error) {
      console.error("Failed to save image from path:", error);
      throw new Error("Failed to save image from file path");
    }
  }

  /**
   * Save image from buffer
   */
  async saveImageFromBuffer(
    imageBuffer: Buffer,
    originalPath?: string
  ): Promise<string> {
    try {
      // Generate unique filename
      const fileId = createId();
      const extension = originalPath
        ? path.extname(originalPath).toLowerCase()
        : ".jpg"; // default extension

      const filename = `${fileId}${extension}`;
      const fullPath = path.join(this.imagesDir, filename);

      // Validate image type
      if (!this.isValidImageExtension(extension)) {
        throw new Error(
          "Invalid image format. Only jpg, jpeg, png, webp are supported."
        );
      }

      // Save the image
      await fs.writeFile(fullPath, imageBuffer);

      console.log(`Image saved: ${filename}`);
      return filename; // Return just the filename, not the full path
    } catch (error) {
      console.error("Failed to save image from buffer:", error);
      throw error;
    }
  }

  /**
   * Save image from Base64 data URL
   */
  async saveImageFromBase64(base64Data: string): Promise<string> {
    try {
      // Extract the base64 data and format
      const matches = base64Data.match(
        /^data:image\/([a-zA-Z0-9]+);base64,(.+)$/
      );

      if (!matches) {
        throw new Error("Invalid base64 image format");
      }

      const [, imageType, base64String] = matches;
      const extension = `.${imageType.toLowerCase()}`;

      // Validate image type
      if (!this.isValidImageExtension(extension)) {
        throw new Error(
          "Invalid image format. Only jpg, jpeg, png, webp are supported."
        );
      }

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(base64String, "base64");

      // Generate unique filename
      const fileId = createId();
      const filename = `${fileId}${extension}`;
      const fullPath = path.join(this.imagesDir, filename);

      // Save the image
      await fs.writeFile(fullPath, imageBuffer);

      console.log(`Image saved from base64: ${filename}`);
      return filename;
    } catch (error) {
      console.error("Failed to save image from base64:", error);
      throw error;
    }
  }

  /**
   * Get image as base64 data URL
   */
  async getImageAsBase64(filename: string): Promise<string | null> {
    try {
      const fullPath = path.join(this.imagesDir, filename);

      // Check if file exists
      try {
        await fs.access(fullPath);
      } catch {
        console.warn(`Image not found: ${filename}`);
        return null;
      }

      const imageBuffer = await fs.readFile(fullPath);
      const extension = path.extname(filename).toLowerCase();

      // Determine MIME type
      let mimeType = "image/jpeg"; // default
      switch (extension) {
        case ".png":
          mimeType = "image/png";
          break;
        case ".webp":
          mimeType = "image/webp";
          break;
        case ".jpg":
        case ".jpeg":
          mimeType = "image/jpeg";
          break;
      }

      const base64String = imageBuffer.toString("base64");
      return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
      console.error("Failed to get image as base64:", error);
      return null;
    }
  }

  /**
   * Get image file path
   */
  getImagePath(filename: string): string {
    return path.join(this.imagesDir, filename);
  }

  /**
   * Delete image
   */
  async deleteImage(filename: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.imagesDir, filename);
      await fs.unlink(fullPath);
      console.log(`Image deleted: ${filename}`);
      return true;
    } catch (error) {
      console.error("Failed to delete image:", error);
      return false;
    }
  }

  /**
   * Validate image extension
   */
  private isValidImageExtension(extension: string): boolean {
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    return validExtensions.includes(extension.toLowerCase());
  }
}

// Create singleton instance
const imageManager = new ImageManager();

export { imageManager };
export default imageManager;
