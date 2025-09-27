import { GetSecurityResponseT } from "@/lib/zod/security.zod";
import { decrypt } from "@/shared/utils/auth-util";
import { getAppSettingsController } from "./settings.controller";

// ================= Login Controller =================
export async function loginController(
  password: string
): Promise<GetSecurityResponseT> {
  try {
    const appSettings = await getAppSettingsController();

    if (!appSettings.success && !appSettings.data)
      throw new Error(appSettings.error || "Failed to fetch app settings");

    // Check if the passed password matches the stored password
    const decryptedPassword = decrypt(appSettings.data.password);

    if (password === decryptedPassword) {
      return {
        data: { message: "Login successful" },
        success: true,
        error: null
      };
    } else throw new Error("Sorry, Password is incorrect!");
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
      success: false
    };
  }
}
