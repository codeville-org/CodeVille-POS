// Alternative implementation with multiple path strategies
import { app } from "electron";
import os from "os";
import path from "path";

// This returns the images directory path with multiple fallback strategies
export function getImagesDirectoryAlternative(): string {
  const possiblePaths = [];

  try {
    if (app && app.isReady()) {
      if (app.isPackaged) {
        // Strategy 1: userData directory (most common)
        possiblePaths.push(app.getPath("userData"));

        // Strategy 2: documents directory
        possiblePaths.push(app.getPath("documents"));

        // Strategy 3: temp directory as last resort
        possiblePaths.push(app.getPath("temp"));
      } else {
        // Development mode
        possiblePaths.push(process.cwd());
      }
    }
  } catch (error) {
    console.error("Failed to get app paths:", error);
  }

  // Fallback strategies
  possiblePaths.push(os.homedir()); // User home directory
  possiblePaths.push(process.cwd()); // Current working directory
  possiblePaths.push(os.tmpdir()); // System temp directory

  // Try each path until we find one that works
  for (const baseDir of possiblePaths) {
    try {
      const imagesPath = path.join(baseDir, "CodeVille-POS", "images");
      console.log(`Attempting to use images directory: ${imagesPath}`);
      return imagesPath;
    } catch (error) {
      console.warn(`Failed to use path ${baseDir}:`, error);
      continue;
    }
  }

  // Final fallback
  const finalPath = path.join(os.tmpdir(), "CodeVille-POS", "images");
  console.log(`Using final fallback path: ${finalPath}`);
  return finalPath;
}
