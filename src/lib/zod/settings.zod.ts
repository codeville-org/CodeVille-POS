import { z } from "zod";
import { getBaseReturnSchema } from "./helpers";

// Key-Value Mapper for App Settings
export const appSettingsMap = z.object({
  // Security Settings
  password: z.string().optional(),
  defaultPrinter: z.string().optional()
});

export const appSettingsMapInsert = appSettingsMap.partial();

export type AppSettingsMapT = z.infer<typeof appSettingsMap>;

export type AppSettingsMapInsertT = z.infer<typeof appSettingsMapInsert>;

// End-to-end Schema
export const getAppSettingsResponse = getBaseReturnSchema(appSettingsMap);

export type GetAppSettingsResponseT = z.infer<typeof getAppSettingsResponse>;
