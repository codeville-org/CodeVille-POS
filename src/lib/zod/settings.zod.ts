import { z } from "zod";
import { getBaseReturnSchema } from "./helpers";

export const storeSettingsSchema = z.object({
  storeLogo: z.string().optional(),
  storeName: z.string().optional(),
  address: z.string().optional(),
  contactPhone: z.string().optional()
});

export type StoreSettingsT = z.infer<typeof storeSettingsSchema>;

// Key-Value Mapper for App Settings
export const appSettingsMap = z.object({
  // Security Settings
  password: z.string().optional(),
  defaultPrinter: z.string().optional(),

  // Store Settings
  ...storeSettingsSchema.shape
});

export const appSettingsMapInsert = appSettingsMap.partial();

export type AppSettingsMapT = z.infer<typeof appSettingsMap>;

export type AppSettingsMapInsertT = z.infer<typeof appSettingsMapInsert>;

// End-to-end Schema
export const getAppSettingsResponse = getBaseReturnSchema(appSettingsMap);

export type GetAppSettingsResponseT = z.infer<typeof getAppSettingsResponse>;
