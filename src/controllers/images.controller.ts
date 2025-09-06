import { logger } from "@/lib/logger";
import { createId } from "@paralleldrive/cuid2";
import { app } from "electron";
import * as fs from "node:fs/promises";
import path from "path";

// This returns the images directory path
export function getImagesDirectory(): string {
  let baseDir: string;

  try {
    // Check if app is ready and available
    if (app && app.isReady()) {
      if (app.isPackaged) {
        // For packaged apps, use userData directory
        baseDir = app.getPath("userData");
        logger.log(`Using userData directory for packaged app: ${baseDir}`);
      } else {
        // Development mode - use current working directory
        baseDir = process.cwd();
        logger.log(
          `Using current working directory for development: ${baseDir}`
        );
      }
    } else {
      // Fallback when app is not ready yet
      logger.warn(
        "Electron app not ready, using current working directory as fallback"
      );
      baseDir = process.cwd();
    }
  } catch (error) {
    logger.error(
      "Failed to get app path, falling back to process.cwd():",
      error
    );
    // Fallback to current working directory if app methods fail
    baseDir = process.cwd();
  }

  const imagesPath = path.join(baseDir, "images");
  logger.log(`Images directory resolved to: ${imagesPath}`);
  return imagesPath;
}

// This function ensures image extension is valid
export function isValidImageExtension(extension: string): boolean {
  const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  return validExtensions.includes(extension.toLowerCase());
}

// Save an image from a base64-encoded string
export async function saveImageFromBase64Controller(
  base64Data: string
): Promise<string> {
  try {
    logger.log("Starting base64 image save process");

    const matches = base64Data.match(
      /^data:image\/([a-zA-Z0-9]+);base64,(.+)$/
    );

    if (!matches) {
      throw new Error("Invalid base64 image format");
    }

    const [, imageType, base64String] = matches;
    const extension = `.${imageType.toLowerCase()}`;
    logger.log(`Image type detected: ${imageType}, extension: ${extension}`);

    if (!isValidImageExtension(extension)) {
      throw new Error(
        "Invalid image format. Only jpg, jpeg, png, webp are supported."
      );
    }

    const imageBuffer = Buffer.from(base64String, "base64");
    const fileId = createId();
    const filename = `${fileId}${extension}`;
    logger.log(`Generated filename: ${filename}`);

    const imagesDirectory = getImagesDirectory();
    logger.log(`Images directory: ${imagesDirectory}`);

    // Ensure the directory exists before writing the file
    try {
      await fs.mkdir(imagesDirectory, { recursive: true });
      logger.log("Directory creation/verification completed");
    } catch (dirError) {
      logger.error("Failed to create images directory:", dirError);
      throw new Error(`Failed to create images directory: ${dirError}`);
    }

    const fullPath = path.join(imagesDirectory, filename);
    logger.log(`Full file path: ${fullPath}`);

    await fs.writeFile(fullPath, imageBuffer);
    logger.log(`Image saved successfully: ${filename}`);
    return filename;
  } catch (error) {
    logger.error("Failed to save image from base64:", error);
    throw error;
  }
}

// Save an image from a file path
export async function saveImageFromPathController(
  sourceImagePath: string
): Promise<string> {
  try {
    logger.log(`Saving image from path: ${sourceImagePath}`);
    const imageBuffer = await fs.readFile(sourceImagePath);
    return await saveImageFromBufferController(imageBuffer, sourceImagePath);
  } catch (error) {
    logger.error("Failed to save image from path:", error);
    throw new Error("Failed to save image from file path");
  }
}

// Save an image from a buffer
export async function saveImageFromBufferController(
  imageBuffer: Buffer,
  originalPath?: string
): Promise<string> {
  try {
    logger.log("Starting buffer image save process");

    const fileId = createId();
    const extension = originalPath
      ? path.extname(originalPath).toLowerCase()
      : ".jpg";
    logger.log(`Extension detected: ${extension}`);

    if (!isValidImageExtension(extension)) {
      throw new Error(
        "Invalid image format. Only jpg, jpeg, png, webp are supported."
      );
    }

    const filename = `${fileId}${extension}`;
    logger.log(`Generated filename: ${filename}`);

    const imagesDirectory = getImagesDirectory();
    logger.log(`Images directory: ${imagesDirectory}`);

    // Ensure the directory exists before writing the file
    try {
      await fs.mkdir(imagesDirectory, { recursive: true });
      logger.log("Directory creation/verification completed");
    } catch (dirError) {
      logger.error("Failed to create images directory:", dirError);
      throw new Error(`Failed to create images directory: ${dirError}`);
    }

    const fullPath = path.join(imagesDirectory, filename);
    logger.log(`Full file path: ${fullPath}`);

    await fs.writeFile(fullPath, imageBuffer);
    logger.log(`Image saved successfully: ${filename}`);
    return filename;
  } catch (error) {
    logger.error("Failed to save image from buffer:", error);
    throw error;
  }
}

// Get an image as a base64-encoded string
export async function getImageAsBase64Controller(
  filename: string
): Promise<string | null> {
  try {
    const imagesDirectory = getImagesDirectory();
    const fullPath = path.join(imagesDirectory, filename);

    try {
      await fs.access(fullPath);
    } catch (error) {
      console.warn("Image not found: ", filename);
      return null;
    }

    const imageBuffer = await fs.readFile(fullPath);
    const extension = path.extname(filename).toLowerCase();

    let mimeType = "image/jpeg";
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

// Delete an image
export async function deleteImageController(
  filename: string
): Promise<boolean> {
  try {
    const imagesDirectory = getImagesDirectory();
    const fullPath = path.join(imagesDirectory, filename);
    await fs.unlink(fullPath);
    console.log(`Image deleted: ${filename}`);
    return true;
  } catch (error) {
    console.error("Failed to delete image:", error);
    return false;
  }
}
