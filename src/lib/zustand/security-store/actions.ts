import { useElectronAPI } from "@/hooks/use-electron-api";
import { GetSecurityResponseT } from "@/lib/zod/security.zod";

export async function loginHandler(
  text: string
): Promise<GetSecurityResponseT> {
  const electron = useElectronAPI();

  const loginResponse = await electron.security.login(text);

  return loginResponse;
}
