import { useElectronAPI } from "@/hooks/use-electron-api";
import { decrypt } from "@/shared/utils/auth-util";

export async function loginHandler(text: string): Promise<string | null> {
  const electron = useElectronAPI();

  // Decrupt the password from app settings
  const appSettings = await electron.settings.get();

  if (!appSettings.success && !appSettings.data) return null;

  const encryptedPassword = appSettings.data.password;

  const decryptedPassword = decrypt(encryptedPassword);

  if (decryptedPassword === text) {
    return decryptedPassword;
  } else return null;
}
