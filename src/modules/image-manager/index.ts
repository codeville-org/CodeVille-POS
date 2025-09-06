import * as fs from "node:fs/promises";
import path from "path";

import {
  deleteImageController,
  getImageAsBase64Controller,
  getImagesDirectory,
  saveImageFromBase64Controller,
  saveImageFromBufferController,
  saveImageFromPathController
} from "@/controllers/images.controller";
import { logger } from "@/lib/logger";

export class ImageManager {
  private imagesDir: string | null = null;

  constructor() {
    // Don't initialize the directory path in constructor
    // This will be set in the initialize() method
  }

  private getImagesDir(): string {
    if (!this.imagesDir) {
      this.imagesDir = getImagesDirectory();
    }
    return this.imagesDir;
  }

  async initialize(): Promise<void> {
    try {
      // Set the images directory path when initializing
      this.imagesDir = getImagesDirectory();
      logger.log(
        `ImageManager: Starting initialization with directory: ${this.imagesDir}`
      );

      // Ensure the directory exists
      logger.log(
        `ImageManager: Attempting to create directory: ${this.imagesDir}`
      );
      await fs.mkdir(this.imagesDir, { recursive: true });
      logger.log(`ImageManager: Directory creation completed`);

      // Verify the directory was created and is accessible
      try {
        await fs.access(this.imagesDir, fs.constants.R_OK | fs.constants.W_OK);
        logger.log(
          `Images directory initialized and accessible at: ${this.imagesDir}`
        );
      } catch (accessError) {
        logger.error(
          `Images directory exists but is not accessible: ${accessError}`
        );
        throw new Error(
          `Images directory is not accessible: ${this.imagesDir}`
        );
      }
    } catch (error) {
      logger.error("Failed to initialize images directory:", error);
      throw error;
    }
  }

  async saveImageFromPath(sourceImagePath: string): Promise<string> {
    return saveImageFromPathController(sourceImagePath);
  }

  async saveImageFromBuffer(
    imageBuffer: Buffer,
    originalPath?: string
  ): Promise<string> {
    return saveImageFromBufferController(imageBuffer, originalPath);
  }

  async saveImageFromBase64(base64Data: string): Promise<string> {
    return saveImageFromBase64Controller(base64Data);
  }

  async getImageAsBase64(filename: string): Promise<string | null> {
    return getImageAsBase64Controller(filename);
  }

  getImagePath(filename: string): string {
    return path.join(this.getImagesDir(), filename);
  }

  async deleteImage(filename: string): Promise<boolean> {
    return deleteImageController(filename);
  }
}

// Create singleton instance
const imageManager = new ImageManager();

export { imageManager };
export default imageManager;
