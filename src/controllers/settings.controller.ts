import { getDB } from "@/database";
import { settings } from "@/database/schema";
import type {
  AppSettingsMapInsertT,
  AppSettingsMapT,
  GetAppSettingsResponseT
} from "@/lib/zod/settings.zod";
import { eq } from "drizzle-orm";

// ================= Get App Settings Controller =================
export async function getAppSettingsController(): Promise<GetAppSettingsResponseT> {
  try {
    const db = getDB();

    const allValues = await db.query.settings.findMany();

    let settingsMap: AppSettingsMapT = {
      password: ""
    };

    for (const setting of allValues) {
      switch (setting.key) {
        case "password":
          settingsMap.password = (setting?.value as string) || "";
          break;
      }
    }

    return {
      data: settingsMap,
      success: true,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
      success: false
    };
  }
}

// ================= Upsert App Settings Controller =================
export async function upsertAppSettingsController(
  payload: AppSettingsMapInsertT
): Promise<GetAppSettingsResponseT> {
  try {
    const db = getDB();

    await Promise.all(
      Object.keys(payload).map(async (key: string) => {
        const keyValue: string | undefined = (payload as Record<string, any>)[
          key
        ];

        if (keyValue) {
          // Check if the setting already exists
          const existingSetting = await db.query.settings.findFirst({
            where: eq(settings.key, key)
          });

          if (existingSetting) {
            // Update the existing setting
            await db
              .update(settings)
              .set({ value: keyValue, updatedAt: new Date() })
              .where(eq(settings.id, existingSetting.id));
          } else {
            // Insert a new setting
            await db.insert(settings).values({ key, value: keyValue });
          }
        }
      })
    );

    const allValues = await db.query.settings.findMany();

    let settingsMap: AppSettingsMapT = {
      password: ""
    };

    for (const setting of allValues) {
      switch (setting.key) {
        case "password":
          settingsMap.password = (setting?.value as string) || "";
          break;
      }
    }

    return {
      data: settingsMap,
      success: true,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: (error as Error).message,
      success: false
    };
  }
}
