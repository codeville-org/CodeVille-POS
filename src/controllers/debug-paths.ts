import { app } from "electron";

// Debug helper function - add this to your images controller for troubleshooting
export function debugPaths(): void {
  console.log("=== Path Debug Information ===");
  console.log(`Process CWD: ${process.cwd()}`);
  console.log(`Process Platform: ${process.platform}`);
  console.log(`Process Arch: ${process.arch}`);

  if (app) {
    console.log(`App isPackaged: ${app.isPackaged}`);
    console.log(`App isReady: ${app.isReady()}`);

    if (app.isReady()) {
      try {
        console.log(`App userData: ${app.getPath("userData")}`);
        console.log(`App documents: ${app.getPath("documents")}`);
        console.log(`App temp: ${app.getPath("temp")}`);
      } catch (error) {
        console.error("Error getting app paths:", error);
      }
    }
  } else {
    console.log("App object not available");
  }

  console.log("=== End Debug Information ===");
}
